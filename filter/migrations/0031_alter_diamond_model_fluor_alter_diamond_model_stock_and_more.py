# Generated by Django 4.1.2 on 2022-12-27 04:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('filter', '0030_alter_fancy_diamond_model_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='diamond_model',
            name='fluor',
            field=models.CharField(blank=True, max_length=255, verbose_name='Fluor'),
        ),
        migrations.AlterField(
            model_name='diamond_model',
            name='stock',
            field=models.CharField(blank=True, max_length=255, verbose_name='Stock #'),
        ),
        migrations.AlterField(
            model_name='fancy_diamond_model',
            name='fluor',
            field=models.CharField(blank=True, max_length=255, verbose_name='Fluor'),
        ),
        migrations.AlterField(
            model_name='fancy_diamond_model',
            name='stock',
            field=models.CharField(blank=True, max_length=255, verbose_name='Stock #'),
        ),
    ]
