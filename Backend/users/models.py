from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth.models import AbstractUser
from rest_framework import authentication, exceptions
from django.contrib.auth import get_user_model
from django.conf import settings
import jwt


class Users(AbstractUser):
    email = models.EmailField(unique=True)
    joinded_date = models.DateTimeField(auto_now=True)
    first_name = None
    last_name = None


class Address(models.Model):
    country = models.CharField(max_length=255, null=True)
    city = models.CharField(max_length=255, null=True)
    street = models.CharField(max_length=255, null=True)
    house_number = models.CharField(max_length=255, null=True)
    apartment = models.CharField(max_length=50, null=True)
    user = models.OneToOneField(Users, unique=True, on_delete=models.CASCADE)


class Profiles(models.Model):
    MALE = 0
    FEMALE = 1
    NOT_SPECIFIED = 2
    GENDER_CHOICES = [
        (MALE, 'Male'),
        (FEMALE, 'Female'),
        (NOT_SPECIFIED, 'Not specified'),
    ]

    first_name = models.CharField(max_length=50, null=True)
    last_name = models.CharField(max_length=50, null=True)
    phoneNumber = PhoneNumberField(unique=True, null=True)
    avatar = models.ImageField(upload_to="avatar/", null=True)
    birthday = models.DateField(null=True)
    user = models.OneToOneField(Users, unique=True, on_delete=models.CASCADE)
    gender = models.IntegerField(choices=GENDER_CHOICES, default=NOT_SPECIFIED)


class UserToken(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(auto_now_add=True, null=True)
    access_token = models.CharField(max_length=255, null=True)
    refresh_token = models.CharField(max_length=255, null=True)


class TokenAuthentication(authentication.BaseAuthentication):

    def authenticate(self, request):
        instance = get_user_model()
        try:
            auth = request.headers['Authorization'].split()
        except KeyError:
            msg = ('User trying to view content with out any authorization')
            raise exceptions.AuthenticationFailed(msg)
            # Bad and ugly idea
        # TODO: Check on front-end if None can be send so python can catch it in the right way!
        if not auth or auth[1] == 'null':
            return None
        try:
            payload = jwt.decode(auth[1], settings.SECRET_KEY,
                                 algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            # On 5front-end should redirect to refresh token
            # And get a new access token
            # See refresh_token func in authen views
            raise exceptions.NotAcceptable()
        try:
            user_id = UserToken.objects.get(access_token=auth[1]).user_id
            user = instance.objects.get(id=user_id)
        except UserToken.DoesNotExist:
            msg = ('User Does not Exist or Anonymous user')
            raise exceptions.AuthenticationFailed(msg)
        if auth[0] != 'Bearer':
            msg = ('Token is not Bearer')
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth) == 1:
            msg = ('Invalid basic headers. No crednetials provided')
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = (
                'Invalid basic headers. Crendentials should not contain space')
            raise exceptions.AuthenticationFailed(msg)
        return (user, None)