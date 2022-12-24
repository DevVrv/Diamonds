from django.db import models

from users.models import CustomUser

# Create your models here.
class CartModal(models.Model):
    user = models.ForeignKey(CustomUser, verbose_name="User Cart", db_index=True, on_delete=models.CASCADE)
    cart_link = models.CharField(max_length=255, verbose_name='Link To Cart', blank=True)
    user_cart = models.JSONField(verbose_name='User Cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user

    class Meta:
        verbose_name = 'User Cart'
        verbose_name_plural = 'User Cart'
