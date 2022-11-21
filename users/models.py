from django.db import models
from django.contrib.auth.models import AbstractUser

# -- custom user
class CustomUser(AbstractUser):

    # choicec lists
    levels_list = (
        (0, '0 - New user'),
        (1, '1 - Verified user'),
        (2, '2 - Approved User'),
        (3, '3 - Vip user'),
    )
    types_list = (
        (0, 'Staff'),
        (1, 'Client'),
        (2, 'Vendor'),
    )
    
    # user info
    username = models.CharField(max_length=250, verbose_name="User Name", unique=True, db_index=True)
    email = models.EmailField(verbose_name="Email", unique=True, db_index=True)
    tel = models.CharField(max_length=250, verbose_name="Tel", unique=True, db_index=True)
    job_title = models.CharField(max_length=250, verbose_name="Job Title")

    # user params 
    remember_me = models.BooleanField(default=False, blank=True)
    level = models.IntegerField(choices=levels_list, verbose_name="User Level", default=0)
    user_type = models.IntegerField(choices=types_list, verbose_name='User Type', default=1)
    manager = models.ForeignKey("CustomUser", verbose_name=("User Manager"), on_delete=models.PROTECT, limit_choices_to= {'is_staff': '1'}, default=1)

    # date fields
    created_date = models.DateField(auto_now_add=True, verbose_name='Created Date', editable=False)
    updated_date = models.DateField(auto_now=True, verbose_name='Updated Date')

    # auth type email
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username",]

    # return self email
    def __str__(self):
        return self.username
    
# -- Company details model
class CompanyDetails(models.Model):
    company_name = models.CharField(max_length=150, verbose_name='Company Name', blank=True)

    company_tel = models.CharField(max_length=150, verbose_name='Business Tel', blank=True)
    company_email = models.CharField(max_length=150, verbose_name='Contact Email', blank=True)
    company_web_address = models.CharField(max_length=150, verbose_name='Web Address', blank=True)

    company_address = models.CharField(max_length=150, verbose_name='Address', blank=True)
    company_city = models.CharField(max_length=150, verbose_name='City', blank=True)
    company_region = models.CharField(max_length=150, verbose_name='State / Province / Region', blank=True)
    company_country = models.CharField(max_length=150, verbose_name='Country', blank=True)
    company_zip = models.CharField(max_length=150, verbose_name='Zipcode / PIN', blank=True)

    user = models.ForeignKey(CustomUser, verbose_name='Associated User', db_index=True, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.pk}'

    class Meta:
        verbose_name = 'Company Details'
        verbose_name_plural = 'Company Details'
        ordering = ['pk']  

# -- Shipping address model
class ShippingAddress(models.Model):
    shipping_company_name = models.CharField(max_length=150, verbose_name='Company Name', blank=True)
    shipping_attention_name = models.CharField(max_length=150, verbose_name='Attention To (Name)', blank=True)

    shipping_tel = models.CharField(max_length=150, verbose_name='Contact Number', blank=True)
    shipping_email = models.CharField(max_length=150, verbose_name='Contact Email', blank=True)

    shipping_address = models.CharField(max_length=150, verbose_name='Address', blank=True)
    shipping_city = models.CharField(max_length=150, verbose_name='City', blank=True)
    shipping_region = models.CharField(max_length=150, verbose_name='State / Province / Region', blank=True)
    shipping_country = models.CharField(max_length=150, verbose_name='Country', blank=True)
    shipping_zip = models.CharField(max_length=150, verbose_name='Zipcode / PIN', blank=True)

    user = models.ForeignKey(CustomUser, verbose_name='Associated User', db_index=True, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.pk}'

    class Meta:
        verbose_name = 'Shipping Address'
        verbose_name_plural = 'Shipping Address'
        ordering = ['pk']  




