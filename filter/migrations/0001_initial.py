# Generated by Django 4.0.6 on 2022-07-22 04:18

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Best_Selling',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'verbose_name': 'Best Selling Diamond',
                'verbose_name_plural': 'Best Selling Diamonds',
            },
        ),
        migrations.CreateModel(
            name='Diamond_Model',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('shape', models.CharField(db_index=True, max_length=150, verbose_name='Shape Name')),
                ('color', models.CharField(blank=True, choices=[('M', 'M'), ('L', 'L'), ('K', 'K'), ('J', 'J'), ('I', 'I'), ('H', 'H'), ('G', 'G'), ('F', 'F'), ('E', 'E'), ('D', 'D')], db_index=True, max_length=150, verbose_name='Color')),
                ('clarity', models.CharField(blank=True, choices=[('I2', 'I2'), ('I1', 'I1'), ('SI2', 'SI2'), ('SI1', 'SI1'), ('VS2', 'VS2'), ('VS1', 'VS1'), ('VVS2', 'VVS2'), ('VVS1', 'VVS1'), ('IF', 'IF'), ('FI', 'FI')], db_index=True, max_length=150, verbose_name='Clarity')),
                ('origin', models.CharField(blank=True, max_length=150, verbose_name='Origin')),
                ('cut', models.CharField(choices=[('N/A', 'N/A'), ('Fair', 'Fair'), ('Good', 'Good'), ('Very Good', 'Very Good'), ('Ideal', 'Ideal'), ('Super Ideal', 'Super Ideal')], max_length=150, verbose_name='Cut')),
                ('polish', models.CharField(blank=True, choices=[('N/A', 'N/A'), ('Good', 'Good'), ('Very Good', 'Very Good'), ('Excellent', 'Excellent')], max_length=150, verbose_name='Polish')),
                ('symmetry', models.CharField(blank=True, choices=[('N/A', 'N/A'), ('Good', 'Good'), ('Very Good', 'Very Good'), ('Excellent', 'Excellent')], max_length=150, verbose_name='Symmetry')),
                ('rap_1ct', models.FloatField(blank=True, verbose_name='Rap. 1ct')),
                ('rap_price', models.FloatField(blank=True, verbose_name='Rap. Price')),
                ('sale_price', models.IntegerField(blank=True, verbose_name='Sale Price')),
                ('disc', models.FloatField(blank=True, verbose_name='Disc')),
                ('weight', models.FloatField(blank=True, db_index=True, verbose_name='Weight')),
                ('length', models.FloatField(blank=True, verbose_name='Length')),
                ('width', models.FloatField(blank=True, verbose_name='Width')),
                ('depth', models.FloatField(blank=True, verbose_name='Depth')),
                ('depth_procent', models.FloatField(blank=True, verbose_name='Depth Procent')),
                ('table_procent', models.FloatField(blank=True, verbose_name='Table')),
                ('lw', models.FloatField(blank=True, verbose_name='L/W: Ratio')),
                ('cert_company', models.CharField(blank=True, max_length=150, verbose_name='Cert Company')),
                ('warehouse', models.CharField(blank=True, max_length=150, verbose_name='Warehouse')),
                ('comments', models.CharField(blank=True, max_length=150, verbose_name='Comments')),
                ('photo', models.ImageField(blank=True, upload_to='diamond_photo/%Y/%m/', verbose_name='Photo')),
                ('video', models.CharField(blank=True, max_length=255, verbose_name='Video')),
                ('gridle_from', models.CharField(blank=True, max_length=150, verbose_name='Gridle From')),
                ('gridle_to', models.CharField(blank=True, max_length=150, verbose_name='Gridle To')),
                ('gridle_type', models.CharField(blank=True, max_length=150, verbose_name='Gridle Type')),
                ('culet', models.CharField(blank=True, max_length=150, verbose_name='Culet')),
                ('fluorescence', models.CharField(blank=True, max_length=150, verbose_name='Fluorescence')),
                ('fluor', models.CharField(blank=True, choices=[('None', 'None'), ('Faint', 'Faint'), ('Medium', 'Medium'), ('Strong', 'Strong'), ('Very Strong', 'Very Strong')], max_length=150, verbose_name='Fluor')),
                ('on_memo', models.CharField(blank=True, default=0, max_length=150, verbose_name='On memo')),
                ('report_link', models.CharField(blank=True, max_length=255, verbose_name='Report Link')),
                ('color_comment', models.CharField(blank=True, max_length=150, verbose_name='Color Comment')),
                ('shape_ex', models.CharField(blank=True, default='N/A', max_length=150, verbose_name='Shape Ex')),
                ('best_selling', models.BooleanField(blank=True, default=False, verbose_name='Best Selling')),
                ('ref', models.CharField(blank=True, max_length=150, verbose_name='Ref')),
                ('vendor', models.CharField(blank=True, max_length=150, verbose_name='Vendor')),
                ('vendor_id', models.CharField(blank=True, max_length=150, verbose_name='Vendor ID')),
                ('cert_number', models.CharField(blank=True, max_length=150, verbose_name='Cert. Number')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created date')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated date')),
                ('key', models.CharField(db_index=True, max_length=255, unique=True, verbose_name='Key')),
            ],
            options={
                'verbose_name': 'Diamond',
                'verbose_name_plural': 'Diamonds',
                'ordering': ['sale_price'],
            },
        ),
    ]
