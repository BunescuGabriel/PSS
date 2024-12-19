from rest_framework import serializers
from users import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Users
        fields = '__all__'
        # fields = ['email', 'is_superuser']


class AddressSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = models.Address
        fields = '__all__'

    def create(self, validated_data):
        validated_data['user_id'] = self.initial_data.get('user_id')
        # validated_data['address_id'] = self.initial_data.get('address_id')
        return models.Address.objects.create(**validated_data)


class ProfilesSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = models.Profiles
        fields = '__all__'

    def create(self, validated_data):
        validated_data['user_id'] = self.initial_data.get('user_id')
        # validated_data['address_id'] = self.initial_data.get('address_id')
        return models.Profiles.objects.create(**validated_data)

