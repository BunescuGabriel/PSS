from rest_framework import generics, response, status
from authen import serializers
from rest_framework import decorators
from users import models
import random
import string
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime
from django.utils import timezone
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view


class RegisterView(generics.CreateAPIView):
    serializer_class = serializers.RegisterSerializer

#### Chain of Responsibility
from .handlers import ValidateInputHandler, GetUserHandler, AuthenticateUserHandler, GenerateTokenHandler

@api_view(['POST'])
def login_view(request):
    # Construirea lanțului de handleri
    chain = ValidateInputHandler(
        GetUserHandler(
            AuthenticateUserHandler(
                GenerateTokenHandler()
            )
        )
    )

    # Contextul inițial
    context = {}

    # Executarea lanțului
    chain.handle(request, context)

    # Obținerea datelor din context
    user = context['user']
    user_token = context['user_token']

    data = {
        'user_id': user.pk,
        'username': user.username,
        'access_token': user_token.access_token,
        'is_superuser': user.is_superuser,
    }

    return response.Response(data, status=status.HTTP_200_OK)


@decorators.api_view(['POST'])
def logout_view(request):
    user_token = models.UserToken.objects.get(
        user_id=request.user.pk,
        access_token=request.auth
    )
    # user_token.delete()
    user_token.access_token = None
    user_token.refresh_token = None
    user_token.logout_time = datetime.now()
    user_token.save()
    msg = {'Logout Successfully'}
    return response.Response(msg, status=status.HTTP_200_OK)


@decorators.api_view(['POST'])
def resetpassword_view(request):
    try:
        try:
            user = models.Users.objects.get(email=request.data['username'])
        except models.Users.DoesNotExist:
            user = models.Users.objects.get(username=request.data['username'])
    except:
        msg = {'User does not exist'}
        return response.Response(msg, status=status.HTTP_404_NOT_FOUND)
    if models.Users.objects.filter(username=request.data['username']).exists() or models.Users.objects.filter(
            email=request.data['username']).exists():
        characters = string.ascii_letters + string.digits + string.punctuation
        password = ''.join(random.choice(characters) for i in range(8))
        user.set_password(password)
        user.save(update_fields=['password'])
        send_mail(
            'reset_password',
            f'You can find your password here:  {password}',
            'admin@admin.com',
            [request.data['username']],
        )
        msg = {'Password reset email sent successfully'}
        return response.Response(msg, status=status.HTTP_200_OK)
    return response.Response(status=status.HTTP_200_OK)


@decorators.api_view(['PATCH'])
def change_password_view(request):
    user = request.user
    serializer = serializers.ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        if not user.check_password(serializer.data.get("old_password")):
            msg = {'Wrong password'}
            return response.Response(msg, status=status.HTTP_400_BAD_REQUEST)

        if serializer.data.get("new_password") != serializer.data.get("confirm_new_password"):
            msg = {'Password do not match'}
            return response.Response(msg, status=status.HTTP_400_BAD_REQUEST)

        if len(serializer.data.get("new_password")) < 8:
            msg = {'Your password is too short'}
            return response.Response(msg, status=status.HTTP_400_BAD_REQUEST)

        if len(serializer.data.get("new_password")) > 16:
            msg = {'Your password is too long'}
            return response.Response(msg, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.data.get("new_password"))
        user.save(update_fields=['password'])
        msg = {'Password was modified successfully'}
        return response.Response(msg, status=status.HTTP_200_OK)

    user_token = models.UserToken.objects.get(
        user_id=request.user.pk,
        access_token=request.auth
    )
    user_token.access_token = None
    user_token.refresh_token = None
    user_token.logout_time = datetime.now()
    user_token.save()
    return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

