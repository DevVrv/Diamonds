# Generated by Django 4.1.2 on 2022-11-23 09:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vendors', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='vedor_diamond_model',
            name='rap_price',
        ),
        migrations.RemoveField(
            model_name='vedor_diamond_model',
            name='report_link',
        ),
        migrations.AlterField(
            model_name='vedor_diamond_model',
            name='cert_number',
            field=models.CharField(db_index=True, max_length=255, unique=True, verbose_name='Certificate'),
        ),
        migrations.AlterField(
            model_name='vedor_diamond_model',
            name='ref',
            field=models.CharField(max_length=255, verbose_name='Stock #'),
        ),
    ]
