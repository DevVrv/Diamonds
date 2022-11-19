import os
from django.conf import settings
from django.http import HttpResponse, Http404
from django.urls import reverse_lazy
from django.shortcuts import redirect
from django.contrib import messages

from django.views.generic import FormView

from .forms import UploadCSVForm
import csv

from filter.models import Diamond_Model
from .models import Vedor_Diamond_Model

# -- white
class White(FormView):

    template_name = 'white.html'
    form_class = UploadCSVForm
    success_url = reverse_lazy('white')
    extra_context = {
        'title': 'White',
        'form': form_class
    }

    # --> POST
    def post(self, request, *args: str, **kwargs):

        form = self.form_class(request.POST, request.FILES)

        if form.is_valid():
            
            num_created = 0
            num_exists = 0
            file = request.FILES['csv']
            
            # -- decode and read file
            decoded_file = file.read().decode('utf-8').splitlines()
            reader = csv.DictReader(decoded_file, delimiter=",")

            # -- read file + create diamond items
            diamonds = []
            try:
                for row in reader:
                    # meke discount
                    disc = row['Discount Percent']
                    if disc != '':
                        disc = float(disc)
                        if disc < 0:
                            disc = disc * -1
                    else:
                        disc = 0
                    
                    # make price
                    price = row['Price']
                    if price == '':
                        price = 0

                    # make new diamond
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
            except KeyError as ex:
                messages.error(request, f'Error reading data from file, missing key {ex}')
                return redirect(self.success_url)
            except Exception as ex:
                messages.error(request, f'Something was wrong, error info: {ex}')
                return redirect(self.success_url)

            # -- create diamonds
            for diamond in diamonds:
                key = diamond['key']

                ref_filter = Diamond_Model.objects.filter(ref=diamond['ref'])
                ref_vendor = Vedor_Diamond_Model.objects.filter(ref=diamond['ref'])

                if ref_filter.exists() or ref_vendor.exists():
                    num_exists += 1
                    continue
                else:
                    created = Vedor_Diamond_Model.objects.create(**diamond)
                    if created:
                        num_created += 1
 
            if num_created == 0:
                messages.warning(request, 'All the presented stones have already been uploaded to the site')
            else:
                messages.success(request, 'The data was uploaded successfully')
                messages.info(request, f'Was created {num_created}, Alredy existed {num_exists}')

        return super().post(request, *args, **kwargs)

# -- round / pear
class RoundPear(FormView):
    template_name = 'round_pear.html'
    success_url = reverse_lazy('round_pear')
    form_class = UploadCSVForm
    extra_context = {
        'title': 'Round / Pear',
        'form': form_class
    }

    # --> POST
    def post(self, request, *args, **kwargs):

        form = self.form_class(request.POST, request.FILES)

        if form.is_valid():
            print(12345)
        else:
            return redirect(self.success_url)

        return super().post(request, *args, **kwargs)

# <-- download white template 
def download(request, path):
    file_path = os.path.join(settings.MEDIA_ROOT, path)
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type="application/vnd.ms-excel")
            response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
            return response
    raise Http404