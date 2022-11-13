# Generated by Django 4.0.6 on 2022-09-05 03:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('vendors', '0005_vendor_diamond_model_vendor_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vendor_diamond_model',
            name='vendor_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Vendo ID'),
        ),
        migrations.DeleteModel(
            name='VendorUsers',
        ),
    ]
