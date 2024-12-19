from about import models
from rest_framework import serializers


class TerminiSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Termini
        fields = '__all__'


class DescriereSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Descrierii
        fields = '__all__'
        # fields = ['id', 'conditi', 'descrierea']


class ConditiiSerializer(serializers.ModelSerializer):
    descrierii = DescriereSerializer(many=True, read_only=True)

    class Meta:
        model = models.Conditii
        fields = ['id', 'titlu', 'text', 'descrierii']


class ServiciSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Servici
        fields = '__all__'


class DetaliiSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Detalii
        fields = '__all__'


class DespreSerializer(serializers.ModelSerializer):
    detalii = DetaliiSerializer(many=True, read_only=True)

    class Meta:
        model = models.Despre
        fields = ['id', 'titlu', 'detalii']


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.City
        fields = ['id', 'name']
