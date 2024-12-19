from produs import models
from rest_framework import serializers


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Banner
        fields = '__all__'


class ImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Images
        fields = '__all__'


class ProdusSerializer(serializers.ModelSerializer):
    images = ImagesSerializer(many=True, read_only=True)

    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    images_to_delete = serializers.ListField(
        child=serializers.IntegerField(),  # presupunând că se folosesc ID-uri pentru imagini
        write_only=True,
        required=False
    )
    class Meta:
        model = models.Produs
        fields = '__all__'

    def create(self, validated_data):
        uploaded_images = validated_data.pop("uploaded_images")
        produs = models.Produs.objects.create(**validated_data)
        for image in uploaded_images:
            models.Images.objects.create(produs=produs, image=image)
        return produs

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        for image in uploaded_images:
            models.Images.objects.create(produs=instance, image=image)

        # Aici se face ștergerea imaginilor
        # images_to_delete = self.context['request'].data.get('images_to_delete', [])
        images_to_delete = validated_data.pop('images_to_delete', [])
        for image_id in images_to_delete:
            try:
                image_to_delete = models.Images.objects.get(id=image_id, produs=instance)
                image_to_delete.delete()
            except models.Images.DoesNotExist:
                pass

        return super().update(instance, validated_data)


class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Comments
        # fields = '__all__'
        fields = ['id', 'comment', 'produs', 'user_id', 'created_at']


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Rating
        fields = ['id', 'rating', 'produs', 'user_id', 'create_da']

    def create(self, validated_data):
        produs = validated_data.pop('produs')
        user = validated_data.pop('user')
        rating = models.Rating.objects.create(produs=produs, user=user, **validated_data)
        produs.update_total_rating()
        return rating

