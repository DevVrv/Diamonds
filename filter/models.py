from django.db import models
from users.models import CustomUser

# * filter diamond model
class Base_Diamond_Model(models.Model):

    stock = models.CharField(max_length=255, verbose_name="Stock #", blank=True)
    certificate = models.CharField(max_length=255, verbose_name="Certificate", unique=True, db_index=True)

    shape = models.CharField(max_length=255, verbose_name="Shape")
    clarity = models.CharField(max_length=255, verbose_name="Clarity")
    color = models.CharField(max_length=255, verbose_name="Color")
    culet = models.CharField(max_length=255, verbose_name="Culet", blank=True)
    cut = models.CharField(max_length=255, verbose_name="Cut", blank=True)
    polish = models.CharField(max_length=255, verbose_name="Polish", blank=True)
    symmetry = models.CharField(max_length=255, verbose_name="Symmetry", blank=True)
    girdle = models.CharField(max_length=255, verbose_name="Gridle", blank=True)
    fluor = models.CharField(max_length=255, verbose_name="Fluor", blank=True)
    measurements = models.CharField(max_length=255, verbose_name="Measurements", blank=True)
    lab = models.CharField(max_length=255, verbose_name="Lab", blank=True)
    
    photo = models.URLField(verbose_name="Image URL", blank=True)
    video = models.URLField(verbose_name="Video URL", blank=True)
    
    total_price = models.IntegerField(verbose_name="Total Price", blank=True, default=0)
    price_per_ct = models.IntegerField(verbose_name="Price Per CT", blank=True, default=0)
    sale_price = models.IntegerField(verbose_name="Sale Price", blank=True)
    rapaport_price = models.IntegerField(verbose_name="Rapaport Price", blank=True, default=0)
    disc = models.FloatField(verbose_name="Disc", blank=True, default=0)
    rap_disc = models.FloatField(verbose_name="Rap Disc", blank=True, default=0)
    
    weight = models.FloatField(max_length=255, verbose_name="Weight", blank=True)
    length_mm = models.FloatField(verbose_name="Length", blank=True)
    width = models.FloatField(verbose_name="Width", blank=True)
    depth = models.FloatField(verbose_name="Depth", blank=True)
    lw = models.FloatField(verbose_name="L/W")
    depth_procent = models.FloatField(verbose_name="Depth %", blank=True)
    table_procent = models.FloatField(verbose_name="Table %", blank=True)


    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created date")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated date")

    is_published = models.BooleanField(default=False, verbose_name="Is Published")
    best_selling = models.BooleanField(default=False, verbose_name="Best Selling")
    vendor = models.ForeignKey(CustomUser, on_delete=models.PROTECT, verbose_name="vendor_email")

    def __str__(self):
        return f'Clarity: {self.clarity}, Color: {self.color}'

    class Meta:
        verbose_name = 'Diamond'
        verbose_name_plural = 'Diamonds'
        ordering = ['sale_price']
        abstract = True

# * filter diamond model
class Diamond_Model(Base_Diamond_Model):
    class Meta:
        verbose_name = 'Diamond'
        verbose_name_plural = 'Diamonds'
        ordering = ['sale_price']

# * Fancy_filter diamond model
class Fancy_Diamond_Model(Base_Diamond_Model):
    class Meta:
        verbose_name = 'Fancy Diamond'
        verbose_name_plural = 'Fancy Diamonds'
        ordering = ['sale_price']

# * fitler max min values
class MaxMin(models.Model):

    name = models.CharField(max_length=255, verbose_name="Filter Name", db_index=True, unique=True)
    
    min = models.FloatField(max_length=255, verbose_name="Min Value")
    max = models.FloatField(max_length=255, verbose_name="Max Value")


    def __str__(self):
        return f'{self.name}'.upper()

    class Meta:
        verbose_name = 'Max / Min Range Values'
        verbose_name_plural = 'Max / Min Range Values'
        ordering = ['name']  