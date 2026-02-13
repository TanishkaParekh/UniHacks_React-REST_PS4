from django.shortcuts import render


# Create your views here.
from django.contrib.auth.hashers import make_password
from .models import UserMe


def user_signup(name, email, password):


    if UserMe.objects.filter(email=email).exists():
        return "Email already exists"


    user = UserMe.objects.create(
        name=name,
        email=email,
        password=make_password(password)
    )


    return user


from django.contrib.auth.hashers import check_password


def user_login(email, password):


    try:
        user = UserMe.objects.get(email=email)
    except UserMe.DoesNotExist:
        return "Invalid email"


    if not check_password(password, user.password):
        return "Invalid password"


    return user




from django.contrib.auth.hashers import make_password
from .models import Institution


def institution_signup(name, email, phone, password):


    if Institution.objects.filter(email=email).exists():
        return "Email already exists"


    admin = Institution.objects.create(
        name=name,
        email=email,
        phone=phone,
        password=make_password(password)
    )


    return admin


from django.contrib.auth.hashers import check_password


def institution_login(email, password):


    try:
        admin = Institution.objects.get(email=email)
    except Institution.DoesNotExist:
        return "Invalid email"


    if not check_password(password, admin.password):
        return "Invalid password"


    return admin


from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import UserMe, Queue, Token




def book_token(request, user_id, queue_id):
    """
    User books a token for a queue
    """


    user = get_object_or_404(UserMe, id=user_id)
    queue = get_object_or_404(Queue, id=queue_id)


    # ❌ If queue is closed or paused
    if queue.is_closed:
        return JsonResponse({"error": "Queue is closed"}, status=400)


    if queue.is_paused:
        return JsonResponse({"error": "Queue is paused"}, status=400)


    # ❌ Check if user already has active token in this queue
    existing_token = Token.objects.filter(
        user=user,
        queue=queue,
        status="WAITING"
    ).first()


    if existing_token:
        return JsonResponse({
            "error": "You already have an active token",
            "token_number": existing_token.token_number
        }, status=400)


    # 🔢 Generate next token number
    last_token = Token.objects.filter(queue=queue).order_by('-token_number').first()


    if last_token:
        next_token_number = last_token.token_number + 1
    else:
        next_token_number = 1


    # ❌ Check queue size limit
    if next_token_number > queue.size:
        return JsonResponse({"error": "Queue is full"}, status=400)


    # ✅ Create token
    token = Token.objects.create(
        user=user,
        queue=queue,
        token_number=next_token_number
    )


    return JsonResponse({
        "message": "Token booked successfully",
        "token_id": token.id,
        "token_number": token.token_number,
        "queue": queue.name,
        "institution": queue.institution.name
    })







# Create your views here.
