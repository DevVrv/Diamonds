# Generated by Django 4.1.2 on 2022-11-16 08:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_customuser_email_alter_customuser_tel_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShippingAddress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('shipping_company_name', models.CharField(blank=True, max_length=150, verbose_name='Company Name')),
                ('shipping_attention_name', models.CharField(blank=True, max_length=150, verbose_name='Attention To (Name)')),
                ('shipping_tel', models.CharField(blank=True, max_length=150, verbose_name='Contact Number')),
                ('shipping_email', models.CharField(blank=True, max_length=150, verbose_name='Contact Email')),
                ('shipping_address', models.CharField(blank=True, max_length=150, verbose_name='Address')),
                ('shipping_city', models.CharField(blank=True, max_length=150, verbose_name='City')),
                ('shipping_region', models.CharField(blank=True, max_length=150, verbose_name='State / Province / Region')),
                ('shipping_country', models.CharField(blank=True, max_length=150, verbose_name='Country')),
                ('shipping_zip', models.CharField(blank=True, max_length=150, verbose_name='Zipcode / PIN')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Associated User')),
            ],
            options={
                'verbose_name': 'Shipping Address',
                'verbose_name_plural': 'Shipping Address',
                'ordering': ['pk'],
            },
        ),
        migrations.CreateModel(
            name='CompanyDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(blank=True, max_length=150, verbose_name='Company Name')),
                ('company_tel', models.CharField(blank=True, max_length=150, verbose_name='Business Tel')),
                ('company_email', models.CharField(blank=True, max_length=150, verbose_name='Contact Email')),
                ('company_web_address', models.CharField(blank=True, max_length=150, verbose_name='Web Address')),
                ('company_address', models.CharField(blank=True, max_length=150, verbose_name='Address')),
                ('company_city', models.CharField(blank=True, max_length=150, verbose_name='City')),
                ('company_region', models.CharField(blank=True, max_length=150, verbose_name='State / Province / Region')),
                ('company_country', models.CharField(blank=True, max_length=150, verbose_name='Country')),
                ('company_zip', models.CharField(blank=True, max_length=150, verbose_name='Zipcode / PIN')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Associated User')),
            ],
            options={
                'verbose_name': 'Company Details',
                'verbose_name_plural': 'Company Details',
                'ordering': ['pk'],
            },
        ),
    ]
