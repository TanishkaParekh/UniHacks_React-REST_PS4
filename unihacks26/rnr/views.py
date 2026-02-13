from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

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
# SMART TOKEN SWAP LOGIC (USP)
# =====================================================


@api_view(['POST'])
def request_swap_api(request):
    sender_token = get_object_or_404(Token, id=request.data.get('token_id'))
    queue = sender_token.queue
   
    # 1. Checks: 20% limit, Credits, and Multi-request prevention
    total_waiting = Token.objects.filter(queue=queue, status="WAITING").count()
    active_swaps = SwapRequest.objects.filter(queue=queue, status="PENDING").count()
    limit = max(1, int(0.2 * total_waiting))


    if active_swaps >= limit:
        return Response({"error": "Swap system busy."}, status=400)
    if sender_token.swaps_used >= queue.max_swaps_per_user:
        return Response({"error": "No swap credits left."}, status=400)
    if SwapRequest.objects.filter(sender=sender_token, status="PENDING").exists():
        return Response({"error": "Pending request already exists."}, status=400)


    # 2. Find target & Range Check
    target_num = request.data.get('target_token_number')
    receiver_token = Token.objects.filter(queue=queue, token_number=target_num, status="WAITING").first()


    if not receiver_token or (sender_token.token_number - receiver_token.token_number) > 3 or receiver_token.token_number >= sender_token.token_number:
        return Response({"error": "Target out of range or invalid."}, status=400)


    SwapRequest.objects.create(sender=sender_token, receiver=receiver_token, queue=queue)
    return Response({"message": "Swap request sent!"})


@api_view(['POST'])
def accept_swap_api(request, swap_id):
    with transaction.atomic():
        swap = get_object_or_404(SwapRequest, id=swap_id, status="PENDING")
        s, r = swap.sender, swap.receiver


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
    
    # Verify institution exists
    institution = get_object_or_404(Institution, id=inst_id)
    
    # Create the queue
    queue = Queue.objects.create(
        institution=institution,
        name=data.get('name'),
        size=data.get('size', 100), # Default size if not provided
        service_time_minutes=data.get('service_time', 5),
        allow_swaps=data.get('allow_swaps', True)
    )
    
    return Response({
        "message": "Queue created successfully",
        "queue_id": queue.id,
        "name": queue.name
    }, status=status.HTTP_201_CREATED)

