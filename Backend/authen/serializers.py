from rest_framework import serializers
from users import models


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError('Your password does not match')
        elif len(attrs['password']) < 8:
            raise serializers.ValidationError('Your password is too short')
        elif len(attrs['password']) > 16:
            raise serializers.ValidationError('Your password is too long')
        return attrs

    def create(self, validated_data):
        validated_data['email'] = self.initial_data.get('email')
        validated_data.popitem()
        user = models.Users.objects.create(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()
    confirm_new_password = serializers.CharField()




