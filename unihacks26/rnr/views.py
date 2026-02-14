from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password, check_password
from django.shortcuts import get_object_or_404
from django.db import transaction, models
from django.utils import timezone


from .models import UserMe, Institution, Queue, Token, SwapRequest
from .serializers import UserMeSerializer, InstitutionSerializer, TokenSerializer




# --- Helper for Automatic Queue Shifting (Re-indexing) ---
def shift_queue_positions(queue):
    """Ensures the queue is continuous. Use after cancellation/snooze."""
    waiting_tokens = Token.objects.filter(queue=queue, status='WAITING').order_by('token_number')
    with transaction.atomic():
        for index, token in enumerate(waiting_tokens, start=1):
            if token.token_number != index:
                token.token_number = index
                token.save()


# =====================================================
# USER AUTH VIEWS
# =====================================================


@api_view(['POST'])
@permission_classes([AllowAny])
def user_signup_api(request):
    data = request.data
    if UserMe.objects.filter(email=data.get('email')).exists():
        return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)


    user = UserMe.objects.create(
        name=data.get('name'),
        email=data.get('email'),
        password=make_password(data.get('password'))
    )
    return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def user_login_api(request):
    data = request.data
    user = UserMe.objects.filter(email=data.get('email')).first()


    if user and check_password(data.get('password'), user.password):
        return Response({
            "message": "Login successful",
            "user_id": user.id,
            "name": user.name,
            "role": "user"
        }, status=status.HTTP_200_OK)


    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)




# =====================================================
# INSTITUTION AUTH VIEWS
# =====================================================


@api_view(['POST'])
@permission_classes([AllowAny])
def institution_signup_api(request):
    data = request.data
    if Institution.objects.filter(email=data.get('email')).exists():
        return Response({"error": "Institution exists"}, status=status.HTTP_400_BAD_REQUEST)


    inst = Institution.objects.create(
        name=data.get('name'),
        email=data.get('email'),
        phone=data.get('phone'),
        address=data.get('address', ''),
        password=make_password(data.get('password'))
    )
    return Response({"message": "Institution created"}, status=status.HTTP_201_CREATED)




@api_view(['POST'])
@permission_classes([AllowAny])
def institution_login_api(request):
    data = request.data
    inst = Institution.objects.filter(email=data.get('email')).first()


    if inst and check_password(data.get('password'), inst.password):
        return Response({
            "message": "Login successful",
            "institution_id": inst.id,
            "name": inst.name,
            "role": "institution"
        }, status=status.HTTP_200_OK)


    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)




# =====================================================
# QUEUE & DISCOVERY OPERATIONS
# =====================================================


@api_view(['GET'])
def search_institutions(request):
    search_query = request.query_params.get('search', '')
    if search_query:
        institutions = Institution.objects.filter(
            models.Q(name__icontains=search_query) | models.Q(address__icontains=search_query)
        )
    else:
        institutions = Institution.objects.all()
    serializer = InstitutionSerializer(institutions, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def book_token_api(request):
    user_id = request.data.get('user_id')
    queue_id = request.data.get('queue_id')
    user = get_object_or_404(UserMe, id=user_id)
    queue = get_object_or_404(Queue, id=queue_id)


    if queue.is_closed or queue.is_paused:
        return Response({"error": "Queue is currently unavailable"}, status=status.HTTP_400_BAD_REQUEST)
    if Token.objects.filter(user=user, queue=queue, status="WAITING").exists():
        return Response({"error": "You already have an active token"}, status=status.HTTP_400_BAD_REQUEST)


    last_token = Token.objects.filter(queue=queue).order_by('-token_number').first()
    next_num = (last_token.token_number + 1) if last_token else 1
    if next_num > queue.size:
        return Response({"error": "Queue is full"}, status=status.HTTP_400_BAD_REQUEST)


    token = Token.objects.create(user=user, queue=queue, token_number=next_num)
    return Response(TokenSerializer(token).data, status=status.HTTP_201_CREATED)


# =====================================================
# CONSOLIDATED SMART POSITION LOGIC
# =====================================================


@api_view(['POST'])
def manage_token_position_api(request):
    token_id = request.data.get('token_id')
    action = request.data.get('action') # CANCEL, MOVE_FORWARD, MOVE_BACK


    with transaction.atomic():
        token = get_object_or_404(Token.objects.select_for_update(), id=token_id)
        queue = token.queue
        current_pos = token.token_number


        if token.status != "WAITING" or token.called_at is not None:
            return Response({"error": "Token cannot be modified."}, status=400)


        # -----------------------------------------------------
        # CANCEL: Re-index + FCFS Logic
        # -----------------------------------------------------
        if action == "CANCEL":
            token.status = 'SKIPPED'
            token.save()
            shift_queue_positions(queue)
           
            if current_pos == 1:
                return Response({
                    "message": "First slot is empty! FCFS claim window open.",
                    "slot_status": "OPEN_FOR_CLAIM"
                }, status=200)
            return Response({"message": "Token cancelled and queue shifted."}, status=200)




        # MOVE FORWARD: Tiered Range (1-10, 11-20, etc.)
        elif action == "MOVE_FORWARD":
            # Active Expiration Cleanup (Auto-terminate old requests)
            expired_requests = SwapRequest.objects.filter(queue=queue, status="PENDING")
            for req in expired_requests:
                if req.is_expired():
                    req.status = "REJECTED"
                    req.save()


            try:
                # Expecting tiered range from Frontend (e.g., 1-10)
                range_start = int(request.data.get("range_start"))
                range_end = int(request.data.get("range_end"))
            except:
                return Response({"error": "Invalid range format."}, status=400)


            # Validate the 10-token interval
            if (range_end - range_start) >= 10:
                return Response({"error": "Interval cannot exceed 10 spots."}, status=400)
           
            if range_end >= current_pos:
                return Response({"error": "Target range must be ahead of your current position."}, status=400)


            total_waiting = Token.objects.filter(queue=queue, status="WAITING").count()
            active_swaps = SwapRequest.objects.filter(queue=queue, status="PENDING").count()
            limit = max(1, int(0.2 * total_waiting))


            if active_swaps >= limit:
                return Response({"error": "Swap system at 20% capacity."}, status=400)


            if token.swaps_used >= queue.max_swaps_per_user:
                return Response({"error": "Swap limit reached."}, status=400)


            # Find the best target (closest to front) in the chosen tier
            receiver = Token.objects.filter(
                queue=queue, status="WAITING",
                token_number__gte=range_start, token_number__lte=range_end
            ).order_by('token_number').first()


            if not receiver:
                return Response({"error": f"No active tokens in range {range_start}-{range_end}."}, status=400)


            SwapRequest.objects.create(sender=token, receiver=receiver, queue=queue)
            return Response({"message": f"Swap request sent to #{receiver.token_number} in tier {range_start}-{range_end}."})


        # -----------------------------------------------------
        # MOVE BACK: Target Position + Intermediate Shift
        # -----------------------------------------------------
        elif action == "MOVE_BACK":
            try:
                target_pos = int(request.data.get("target_position"))
            except:
                return Response({"error": "Invalid position format."}, status=400)


            if target_pos <= current_pos:
                return Response({"error": "Target must be behind current position."}, status=400)


            last_token = Token.objects.filter(queue=queue, status="WAITING").order_by('-token_number').first()
            actual_target = min(target_pos, last_token.token_number if last_token else current_pos)


            tokens_to_shift = Token.objects.filter(
                queue=queue, status="WAITING",
                token_number__gt=current_pos, token_number__lte=actual_target
            ).select_for_update()


            for t in tokens_to_shift:
                t.token_number -= 1
                t.save()


            token.token_number = actual_target
            token.save()
            return Response({"message": f"Moved back to position {actual_target}."})


    return Response({"error": "Invalid action."}, status=400)




@api_view(['POST'])
def accept_swap_api(request, swap_id):
    with transaction.atomic():
        swap = get_object_or_404(SwapRequest.objects.select_for_update(), id=swap_id, status="PENDING")
        s, r = swap.sender, swap.receiver


        if swap.is_expired():
            swap.status = "REJECTED"
            swap.save()
            return Response({"error": "Swap request expired."}, status=400)


        if s.status != "WAITING" or r.status != "WAITING":
            swap.status = "REJECTED"
            swap.save()
            return Response({"error": "Swap no longer valid."}, status=400)


        # Exchange Numbers
        s.token_number, r.token_number = r.token_number, s.token_number
        s.swaps_used += 1
        r.user.reward_points += 5
       
        s.save()
        r.save()
        r.user.save()
        swap.status = "ACCEPTED"
        swap.save()
       
        # Cleanup
        SwapRequest.objects.filter(models.Q(sender=s) | models.Q(receiver=s) | models.Q(sender=r) | models.Q(receiver=r), status="PENDING").exclude(id=swap.id).update(status="REJECTED")


    return Response({"message": "Swap successful!"})


# =====================================================
# INSTITUTION DASHBOARD & LIFECYCLE
# =====================================================


@api_view(['GET'])
def get_institution_dashboard(request, inst_id):
    institution = get_object_or_404(Institution, id=inst_id)
    queues = Queue.objects.filter(institution=institution)
    data = []
    for q in queues:
        waiting_tokens = Token.objects.filter(queue=q, status='WAITING').order_by('token_number')
        data.append({
            "queue_id": q.id,
            "queue_name": q.name,
            "total_waiting": waiting_tokens.count(),
            "current_serving": waiting_tokens.first().token_number if waiting_tokens.exists() else "None",
            "lineup": TokenSerializer(waiting_tokens, many=True).data
        })
    return Response(data)


@api_view(['POST'])
def call_next_token(request, queue_id):
    institution_id = request.data.get("institution_id")


    queue = get_object_or_404(Queue, id=queue_id)
   
    if queue.institution.id != int(institution_id):
        return Response({"error": "Unauthorized"}, status=403)


    next_token = Token.objects.filter(queue=queue, status='WAITING').order_by('token_number').first()


    if not next_token:
        return Response({"message": "Queue empty"}, status=200)


    next_token.called_at = timezone.now()
    next_token.save()


    return Response(TokenSerializer(next_token).data)




@api_view(['POST'])
def confirm_token_api(request, token_id):
    token = get_object_or_404(Token, id=token_id)
    if not token.called_at:
        return Response({"error": "Token not called yet"}, status=400)


    if token.is_call_expired():
        # Late for appointment -> Auto Snooze
        last_t = Token.objects.filter(queue=token.queue).order_by('-token_number').first()
        token.token_number = last_t.token_number + 1
        token.called_at = None
        token.save()
        shift_queue_positions(token.queue)
        return Response({"error": "Expired. Moved to back."}, status=403)


    token.status = 'COMPLETED'
    token.user.reward_points += 10
    token.save()
    token.user.save()
    return Response({"message": "Check-in successful!"})


@api_view(['POST'])
def snooze_api(request, token_id):
    token = get_object_or_404(Token, id=token_id)
    last_t = Token.objects.filter(queue=token.queue).order_by('-token_number').first()
    token.token_number = last_t.token_number + 1
    token.called_at = None
    token.save()
    shift_queue_positions(token.queue)
    return Response({"message": "Snoozed to back."})


@api_view(['POST'])
def create_queue_api(request):
    """
    Institution creates a new queue.
    Expects: {"institution_id": 1, "name": "General Counter", "size": 100}
    """
    data = request.data
    inst_id = data.get('institution_id')
    institution = get_object_or_404(Institution, id=inst_id)
    
    queue = Queue.objects.create(
        institution=institution,
        name=data.get('name'),
        size=data.get('size', 100),
        service_time_minutes=data.get('service_time', 5),
        allow_swaps=data.get('allow_swaps', True)
    )
    
    return Response({
        "message": "Queue created successfully",
        "queue_id": queue.id,
        "name": queue.name
    }, status=status.HTTP_201_CREATED)
