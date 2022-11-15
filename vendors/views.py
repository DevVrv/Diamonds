from django.shortcuts import render 
from django.contrib import messages
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from django.views.generic import FormView

import os
from django.conf import settings
from django.http import HttpResponse, Http404

import csv

from filter.models import Diamond_Model
from .models import Vedor_Diamond_Model
from .forms import UploadCSV, VendorCreationForm
from users.models import CustomUser


# * vendor create
class CreateVendor(FormView):
    
    # -- class settings
    template_name = 'create_vendor.html'
    form_class = VendorCreationForm
    success_url = reverse_lazy('create_vendor')
    extra_context = {
        'title': 'Vendor Registration'
    }

    # --> POST
    def form_valid(self, form):
    
        # -- form is valid
        if form.is_valid():
            
            # -- create new user
            form.save()

            user_name = form.cleaned_data.get('username')
            user = CustomUser.objects.get(username=user_name)
            user.user_type = 2
            user.save()

            # -- return form valid
            messages.success(self.request, 'The vendor was created')
            return super().form_valid(form)

        # -- render template
        return render(self.request, 'signup.html', self.get_context_data())
    
    def form_invalid(self, form):
        print(form.errors)
        
        messages.error(self.request, form.errors)
        return super().form_invalid(form)

    # <-- GET
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

# * white
def diamonds_white(request):

    # * urls
    refused_url = 'signin'
    this_url = 'white'

    # * form 
    form = UploadCSV(request.POST or None)

    # @ POST
    if request.method == 'POST':
        try:
            num_created = 0
            num_updated = 0
            file = request.FILES['diamonds']
            
            # * if not csv
            if not file.name.endswith('.csv'):
                messages.error(request, 'The uploaded file must be in the format: CSV')
                return redirect(reverse_lazy(this_url))
            
            # * decode and read file
            decoded_file = file.read().decode('utf-8').splitlines()
            reader = csv.DictReader(decoded_file, delimiter=",")

            # * check the kyes in file
            keys_prm = [
                'Stock #',
                'Certificate #',
                'Shape',
                'Clarity',
                'Color',
                'Total Price',
                'Girdle Condition',
                'Culet Condition',
                'Weight',
                'Cut Grade',
                'Polish',
                'Symmetry',
                'Culet Condition',
                'Fluorescence Intensity',
                'Measurements Length',
                'Measurements Width',
                'Measurements Depth',
                'Measurements',
                'Lab',
                'Depth Percent',
                'Table Percent',
                'Image Link',
                'Video Link',
            ]
            keys = []
            keys_lost = []
            for row in reader:
                for item in row:
                    for key in keys_prm:
                        if item == key:
                            keys.append(item)
                break
            for x in keys_prm:
                if x not in keys:
                    keys_lost.append(x)
            if len(keys_lost) != 0:
                messages.error(request, 'This file does not meet all the requirements')
                context = {
                    'form': form,
                    'keys_lost': keys_lost
                }
                return render(request, 'upload_diamonds.html', context)

            # * read file + create diamond items
            diamonds = []
            for row in reader:

                # discount
                disc = row['Discount Percent']
                if disc != '':
                    disc = float(disc)
                    if disc < 0:
                        disc = disc * -1
                else:
                    disc = 0
                
                # price
                price = row['Price']
                if price == '':
                    price = 0

                # diamond object
                diamond = {
                    'ref': row['Stock #'],
                    'vendor_id': request.user.id,
                    'cert_number': row['Certificate #'],

                    'shape': row['Shape'],
                    'clarity': row['Clarity'],
                    'color': row['Color'],

                    'rap_1ct': price,
                    'sale_price': row['Total Price'],
                    'disc': disc,
                    
                    'girdle': row['Girdle Condition'],
                    'culet': row['Culet Condition'],
                    'weight': row['Weight'],
                    'cut': row['Cut Grade'],
                    'polish': row['Polish'],
                    'symmetry': row['Symmetry'],
                    'culet': row['Culet Condition'],
                    'fluor': row['Fluorescence Intensity'],
                    'length': row['Measurements Length'],
                    'width': row['Measurements Width'],
                    'depth': row['Measurements Depth'],
                    'lw': round(float(row['Measurements Length']) / float(row['Measurements Width'])),
                    'measurements': row['Measurements'],
                    'lab': row['Lab'], 

                    'depth_procent': row['Depth Percent'],
                    'table_procent': row['Table Percent'],
                    'photo': row['Image Link'],
                    'video': row['Video Link'],

                    'key': f"{row['Stock #']};{request.user.id};{row['Certificate #']};{row['Color']};{row['Clarity']}",
                }
                diamonds.append(diamond)

            # * update stones 
            for diamond in diamonds:
                key = diamond['key']
                stone, created = Vedor_Diamond_Model.objects.update_or_create(key=key, defaults=diamond)

                if created:
                    num_created += 1
                else:
                    num_updated += 1

            messages.success(request, 'The data was uploaded successfully')
            context = {
                'form': form,
                'num_created': num_created,
                'num_updated': num_updated
            }
            return render(request, 'upload_diamonds.html', context)
        except Exception as ex:
            print(ex)
            messages.error(request, 'Your file does not meet all the requirements')
            context = {
                'form': form,
            }
            return render(request, 'upload_diamonds.html', context)

    # <-- get
    context = {
        'form': form
    }
    return render(request, 'upload_diamonds.html', context)

# * update diamonds data
def diamonds_data(request):

    # * urls
    refused_url = 'signin'
    this_url = 'diamonds_data'

    # * get form
    form = UploadCSV()

    # msg vars
    updated = 0
    shape_type = None
    msg = False

    # @ POST
    if request.method == 'POST':
        
        # * get form + file
        form = UploadCSV(request.POST)
        file = request.FILES['diamonds']
        file_names = file.name.split('_')

        # * check file type and file name
        if not file.name.endswith('.csv'):
            messages.error(request, 'The uploaded file must be in the format: CSV')
            return redirect(reverse_lazy(this_url))

        # * check the file type ROUND / PEAR else redirect
        bool = False
        for name in file_names:
            if name != 'ROUND' and name != 'PEAR':
                bool = False
            else:
                bool = True
                shape_type = name
                break
        if bool == False:
            messages.error(request, 'Pleace select the Round or Pear file')
            return redirect(reverse_lazy(this_url))

        # * decode and read file
        file = request.FILES['diamonds'] 
        decoded_file = file.read().decode('utf-8').splitlines()
        reader = csv.reader(decoded_file, delimiter=";")
        
        # * get diamonds list 
        diamonds_list = Diamond_Model.objects.all()
        if shape_type == 'ROUND':
            diamonds_list = diamonds_list.filter(shape = 'Round')
        elif shape_type == 'PEAR':
            diamonds_list = diamonds_list.exclude(shape = 'Round')
        else:
            messages.error(request, 'Oops, Some thing wath wrong')
            return redirect(reverse_lazy(this_url))

        # * update diamonds list values
        diamonds_updated_list = []
        for row in reader:
            for item in row:

                # <-- get file values
                values = item.split(',')
                file_clarity = values[1]
                file_color = values[2]
                file_weight_from = float(values[3])
                file_weight_to = float(values[4])
                file_rap_1ct = float(values[5])

                for diamond in diamonds_list:

                    # <-- get diamonds values
                    diamond_clarity = diamond.clarity
                    diamond_color = diamond.color
                    diamond_weight = float(diamond.weight)

                    if file_clarity == diamond_clarity and file_color == diamond_color:
                        if file_weight_from <= diamond_weight and file_weight_to >= diamond_weight:
                            # * update diamond
                            diamond.rap_1ct = file_rap_1ct
                            diamond.rap_price = file_rap_1ct * diamond_weight
                            diamond.disc = round(diamond.sale_price/diamond.rap_price, 2)
                            diamonds_updated_list.append(diamond)

        # * remove doubles from updated diamonds
        for diamond in diamonds_list:
            for updated_diamond in diamonds_updated_list:
                if diamond.key == updated_diamond.key:
                    diamond.rap_1ct = updated_diamond.rap_1ct
                    diamond.rap_price = updated_diamond.rap_price
                    diamond.save()

        # * updated len
        updated = len(diamonds_updated_list)

        # * success message
        messages.success(request, 'The data was uploaded successfully')
    
    # * msg
    if updated != 0:
        msg = f'Stones has been updated: {updated}, You have uploaded the {shape_type} file'

    # * context
    context = {
        'title': 'Update Diamonds Data',
        'form': form,
        'msg': msg
    }

    return render(request, 'upload_diamonds_data.html', context)

# <-- download white template 
def download(request, path):
    file_path = os.path.join(settings.MEDIA_ROOT, path)
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type="application/vnd.ms-excel")
            response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
            return response
    raise Http404