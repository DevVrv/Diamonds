# Generated by Django 4.0.6 on 2022-09-25 12:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vendors', '0015_alter_vedor_diamond_model_culet_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vedor_diamond_model',
            name='rap_price',
            field=models.IntegerField(blank=True, null=True, verbose_name='Rap Price'),
        ),
    ]
