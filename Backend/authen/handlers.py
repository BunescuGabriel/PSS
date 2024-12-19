from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError
from users import models
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from authen import serializers


class BaseHandler:
    def __init__(self, next_handler=None):
        self.next_handler = next_handler

    def handle(self, request, context):
        if self.next_handler:
            return self.next_handler.handle(request, context)
        return context


class ValidateInputHandler(BaseHandler):
    def handle(self, request, context):
        serializer = serializers.LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        context['username_or_email'] = request.data['username']
        context['password'] = request.data['password']
        return super().handle(request, context)


class GetUserHandler(BaseHandler):
    def handle(self, request, context):
        username_or_email = context['username_or_email']
        try:
            user = models.Users.objects.get(username=username_or_email)
        except models.Users.DoesNotExist:
            try:
                user = models.Users.objects.get(email=username_or_email)
            except models.Users.DoesNotExist:
                raise ValidationError({'error': 'User does not exist'})

        context['user'] = user
        return super().handle(request, context)


class AuthenticateUserHandler(BaseHandler):
    def handle(self, request, context):
        user = context['user']
        password = context['password']
        authenticated_user = authenticate(username=user.username, password=password)
        if authenticated_user is None:
            raise ValidationError({'error': 'Wrong password'})
        context['user'] = authenticated_user
        return super().handle(request, context)


class GenerateTokenHandler(BaseHandler):
    def handle(self, request, context):
        user = context['user']
        try:
            user_token = models.UserToken.objects.get(user_id=user.pk)
        except models.UserToken.DoesNotExist:
            token = RefreshToken.for_user(user)
            user_token, _ = models.UserToken.objects.get_or_create(
                user_id=user.pk,
                access_token=str(token.access_token),
                refresh_token=str(token),
                created=timezone.now()
            )
        else:
            if user_token.access_token is None or user_token.refresh_token is None:
                token = RefreshToken.for_user(user)
                user_token.access_token = str(token.access_token)
                user_token.refresh_token = str(token)
                user_token.logout_time = None
                user_token.created = timezone.now()
                user_token.save(update_fields=['access_token', 'refresh_token', 'created', 'logout_time'])

        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        context['user_token'] = user_token
        return super().handle(request, context)
