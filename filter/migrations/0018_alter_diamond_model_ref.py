# Generated by Django 4.1.2 on 2022-11-19 13:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('filter', '0017_alter_diamond_model_rap_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='diamond_model',
            name='ref',
            field=models.CharField(max_length=255, unique=True, verbose_name='Ref'),
        ),
    ]
