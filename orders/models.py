from django.db import models
from users.models import CustomUser
from filter.models import Base_Diamond_Model

# * Create your models here.
class Orders_model(models.Model):

    # * choice lists
    order_status_list = (
        ('0', 'Rejected'),
        ('1', 'On verification'),
        ('2', 'Order accepted'),
        ('3', 'Delivery is in progress'),
        ('4', 'Delivered'),
        ('5', 'Completed'), 
    )
    
    order_type_list = (
        ('0', 'COD'),
        ('1', 'Invocie'),
        ('2', 'Cash Memo'),
        ('3', 'Memo'),
        ('4', 'Hold'),
    )
    
    # * order info
    user = models.ForeignKey(CustomUser, verbose_name="user", on_delete=models.CASCADE, db_index=True)
    order_type = models.CharField(max_length=1, verbose_name="Order Type", choices=order_type_list, db_index=True, default='1')
    order_status = models.CharField(max_length=1, verbose_name="Order Status", choices=order_status_list, default='1', db_index=True)
    order_number = models.CharField(max_length=255, verbose_name="Order Number", db_index=True, unique=True)
    
    # * request info
    comment = models.CharField(max_length=255, verbose_name="Comment", blank=True)
    pay_within = models.IntegerField(verbose_name="Pay Within", blank=True)
    p_ct_offer = models.FloatField(verbose_name="P/ct Offer", blank=True)
    total_price_offer = models.FloatField(verbose_name="Total Price Offer", blank=True)
    hold_hours = models.IntegerField(verbose_name='hold_hours', blank=True)

    # * order diamonds info
    diamonds_list = models.JSONField(verbose_name="Diamonds List")
    total_diamonds = models.IntegerField(verbose_name="Total Diamonds")
    total_carat = models.FloatField(verbose_name="Total Carat")
    total_price = models.IntegerField(verbose_name="Total Price")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created Date")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated Date")
    
    def __str__(self):
        return f''

    class Meta:
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
        ordering = ['user']

# * filter diamond model
class Orders_Diamond_Model(Base_Diamond_Model):

    cert_number = models.CharField(verbose_name='Cert Number', max_length=255, db_index=True, unique=False)

    buyer = models.ForeignKey(CustomUser, verbose_name="Buyer", on_delete=models.CASCADE, db_index=True, related_name='buyer_id')
    order = models.ForeignKey(Orders_model, verbose_name="Order ID", on_delete=models.CASCADE, db_index=True)
    order_number = models.CharField(max_length=255, verbose_name="Order Number", db_index=True)
