# Generated by Django 4.1.2 on 2022-11-24 07:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('orders', '0002_remove_orders_diamond_model_rap_price_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='orders_diamond_model',
            old_name='length',
            new_name='length_mm',
        ),
        migrations.AlterField(
            model_name='orders_diamond_model',
            name='vendor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL, verbose_name='vendor_email'),
        ),
    ]
