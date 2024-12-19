from PIL import Image
from rest_framework.exceptions import ValidationError

class BannerAdapter:
    def __init__(self, validated_data):
        self.validated_data = validated_data

    def adapt(self):
        name_banner = self.validated_data.get('name_banner')
        banner = self.validated_data.get('banner')

        if banner is not None:
            try:
                img = Image.open(banner)
                if img.format not in ('JPEG', 'PNG', 'JPG', 'GIF'):
                    raise ValidationError({'banner': 'Invalid image format'})
                if img.width > 10000 or img.height > 10000:
                    raise ValidationError({'banner': 'Image dimensions are too large'})
            except Exception as e:
                raise ValidationError({'banner': 'Invalid image'})

        return {
            'name_banner': name_banner,
            'banner': banner
        }
