# Generated by Django 4.1.2 on 2022-12-04 11:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('vendors', '0003_rename_length_vedor_diamond_model_length_mm_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='vedor_diamond_model',
            old_name='cert_number',
            new_name='certificate',
        ),
        migrations.RenameField(
            model_name='vedor_diamond_model',
            old_name='ref',
            new_name='stock',
        ),
    ]
