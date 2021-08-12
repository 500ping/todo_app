from django.db import models
from django.contrib.auth.models import User
from django.db.models.fields.related import ForeignKey


class MustBuy(models.Model):
    user = ForeignKey(User, on_delete=models.CASCADE)
    name = models.TextField(max_length=150)
    price = models.FloatField()
    expect_date = models.DateField(null=True, blank=True)
    create_date = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.name

    def get_user_mustbuy(user):
        return MustBuy.objects.filter(user=user).order_by('create_date')


