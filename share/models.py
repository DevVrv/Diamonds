from django.db import models
from users.models import CustomUser
# Create your models here.

class ShareModel(models.Model):

    shareTypeList = (
        ('0', 'Without Prices'),
        ('1', 'With Prices'),
    )

    share_list = models.JSONField(verbose_name='Diamonds Share List')
    share_type = models.CharField(choices=shareTypeList, max_length=1, verbose_name='Share type')
    user = models.ForeignKey(CustomUser, verbose_name="User ID", on_delete=models.CASCADE)

    share_key = models.CharField(max_length=150, verbose_name='Share Key')

    created_at = models.DateField(auto_now_add=True, verbose_name='Created Date')
    updated_at = models.DateField(auto_now=True, verbose_name='Updated Date')
