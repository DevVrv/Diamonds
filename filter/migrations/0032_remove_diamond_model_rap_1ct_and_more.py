# Generated by Django 4.1.2 on 2022-12-27 04:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('filter', '0031_alter_diamond_model_fluor_alter_diamond_model_stock_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='diamond_model',
            name='rap_1ct',
        ),
        migrations.RemoveField(
            model_name='fancy_diamond_model',
            name='rap_1ct',
        ),
        migrations.AddField(
            model_name='diamond_model',
            name='price_per_ct',
            field=models.IntegerField(blank=True, default=0, verbose_name='Price Per CT'),
        ),
        migrations.AddField(
            model_name='diamond_model',
            name='total_price',
            field=models.IntegerField(blank=True, default=0, verbose_name='Total Price'),
        ),
        migrations.AddField(
            model_name='fancy_diamond_model',
            name='price_per_ct',
            field=models.IntegerField(blank=True, default=0, verbose_name='Price Per CT'),
        ),
        migrations.AddField(
            model_name='fancy_diamond_model',
            name='total_price',
            field=models.IntegerField(blank=True, default=0, verbose_name='Total Price'),
        ),
    ]
