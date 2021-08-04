from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Task(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    status = models.BooleanField(default=False)
    create_date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.name
