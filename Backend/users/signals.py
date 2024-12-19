from django.db.models.signals import post_save
from django.dispatch import receiver
from users import models


@receiver(post_save, sender=models.Users)
def token_handler(sender, instance=None, created=False, **kwargs):
    if created:
        models.UserToken.objects.create(
            user_id=instance.pk,
            access_token=None, refresh_token=None)