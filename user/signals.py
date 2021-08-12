# save user_profile when a new user created

from django.contrib.auth.models import User
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import UserProfile
from common.utils import send_widget_information

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
        send_widget_information()

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

@receiver(post_delete, sender=User)
def send_widget_info(sender, instance, *args, **kwargs):
    print(*args)
    send_widget_information()