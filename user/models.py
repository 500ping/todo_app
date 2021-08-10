from django.db import models
from django.contrib.auth.models import User

gender = [
    ('Male', 'male'),
    ('Female', 'female'),
    ('Other', 'other')
]

class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    gender = models.CharField(max_length=7, choices=gender, default='Male')
    avatar = models.ImageField(null=True, blank=True)
    about = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.user.username
