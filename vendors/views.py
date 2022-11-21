import os
from django.conf import settings
from django.http import HttpResponse, Http404
from django.urls import reverse_lazy
from django.shortcuts import redirect
from django.contrib import messages
from users.inspector import Inspector

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
    }

    # --> POST
    def post(self, request, *args: str, **kwargs):
        form = self.form_class(request.POST, request.FILES)
        if form.is_valid():
            num_created = 0
            num_exists = 0
            num_error = 0
            file = request.FILES['csv']
            
            # -- decode and read file
            decoded_file = file.read().decode('utf-8').splitlines()
            reader = csv.DictReader(decoded_file, delimiter=",")

            # -- read file + create diamond items
            diamonds = []
            try:
                for row in reader:
                    # make new diamond
                    diamond = {
                        'ref': row['Ref'],
                        'vendor_id': request.user.id,
                        'cert_number': row['Cert. Number'],
                        'lab': row['Cert. Company'], 

                        'shape': row['Shape'],
                        'clarity': row['Clarity'],
                        'color': row['Color'],

                        'rap_1ct': row['Rap. 1ct'],
                        'sale_price': row['Sale Price'],
                        'disc': 0,
                        
                        'weight': row['Weight'].replace(',', '.'),
                        'width': row['Width'].replace(',', '.'),
                        'length': row['Length'].replace(',', '.'),
                        'girdle': row['Girdle Type'],
                        'culet': row['Culet'],
                        'cut': row['Cut'],
                        'polish': row['Polish'],
                        'symmetry': row['Symmetry'],
                        'fluor': row['Fluorescence'],
                        'depth': row['Depth'].replace(',', '.'),
                        'lw': round(float(row['Length'].replace(',', '.')) / float(row['Width'].replace(',', '.'))),
                        'measurements': f"{row['Length']}x{row['Width']}x{row['Depth']}",
                        'depth_procent': row['Depth %'].replace(',', '.'),
                        'table_procent': row['Table %'].replace(',', '.'),

                        'video': row['Video'],
                        'photo': '',
                        'report_link': row['Report Link']
                    }
                    diamonds.append(diamond)
            except KeyError as ex:
                messages.error(request, f'Error reading data from file, missing field {ex}')
                return redirect(self.success_url)
            except Exception as ex:
                messages.error(request, f'Something was wrong, error info: {ex}')
                return redirect(self.success_url)

            # -- create diamonds
            for diamond in diamonds:
                diamond_filter = Diamond_Model.objects.filter(cert_number=diamond['cert_number'])
                diamond_vendor = Vedor_Diamond_Model.objects.filter(cert_number=diamond['cert_number'])

                if diamond_filter.exists() or diamond_vendor.exists():
                    num_exists += 1
                    continue
                else:
                    try:
                        created = Vedor_Diamond_Model.objects.create(**diamond)
                        if created:
                            num_created += 1
                    except Exception as ex:
                        print(ex)
                        num_error += 1
                        continue
                        
            if num_created:
                messages.success(request, 'The data was uploaded successfully')
                messages.info(request, f'Was created: {num_created} | Alredy existed: {num_exists}')
            else:
                messages.warning(request, 'All the presented stones have already been uploaded to the site')

            if num_error:
                messages.error(request, f'Error, some stones was not created: {num_error}')

        return super().post(request, *args, **kwargs)

    # <-- GET
    def get(self, request, *args, **kwargs):

        # -- permissions
        permission = Inspector(request)
        if not permission.auth and not permission.type == '2' and not permission.super:
            return redirect(reverse_lazy('signin'))

        return super().get(request, *args, **kwargs)

# -- round / pear
class RoundPear(FormView):
    template_name = 'round_pear.html'
    form_class = UploadCSVForm
    success_url = reverse_lazy('round_pear')
    extra_context = {
        'title': 'Round / Pear',
    }

    # --> POST
    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST, request.FILES)
        
        if form.is_valid():
            try:
                # -- decode and read file
                file = request.FILES['csv'] 
                decoded_file = file.read().decode('utf-8').splitlines()
                reader = csv.reader(decoded_file, delimiter=";")

                # -- get diamonds list 
                br = 0
                ps = 0
                else_type = 0
                for row in reader:
                    for value in row:
                        values = value.split(',')
                        if values[0] == 'BR':
                            br+=1
                        elif values[0] == 'PS':
                            ps+=1
                        else:
                            else_type+1
                if not else_type and not ps and br:
                    diamonds = Diamond_Model.objects.filter(shape='Round')
                elif not else_type and not br and ps:
                    diamonds = Diamond_Model.objects.all().exclude(shape='Round')
                else:
                    messages.error(request, 'Incorrect file data format')
                    return redirect(self.success_url)
            
                # -- new values for diamonds
                new_diamonds_values = []

                # --> read file rows
                for row in reader:
                    for item in row:
                        values = item.split(',')
                        file_clarity = values[1]
                        file_color = values[2]
                        file_weight_from = float(values[3])
                        file_weight_to = float(values[4])
                        file_rap_1ct = float(values[5])

                        for diamond in diamonds:
                            diamond_weight = float(diamond.weight)
                            if file_clarity == diamond.clarity and file_color == diamond.color:
                                if file_weight_from <= diamond_weight and file_weight_to >= diamond_weight:
                                    new_diamond = {
                                        'rap_1ct': file_rap_1ct,
                                        'rap_price': file_rap_1ct * diamond_weight,
                                        'disc': round(diamond.sale_price/diamond.rap_price, 2)
                                    }
                                    new_diamonds_values.append(new_diamond)
                
                for diamond in diamonds:
                    for new_values in new_diamonds_values:
                        if diamond.cert_number == new_values.cert_number:
                            diamond.rap_1ct = new_values.rap_1ct
                            diamond.rap_price = new_values.rap_price
                            diamond.disc = new_values.disc
                            diamond.save()

                # -- updated len
                updated = len(new_diamonds_values)

                # -- success
                if updated != 0:
                    messages.success(request, f'Successfully, {updated} diamonds was updated')
                else:
                    messages.warning(request, f'The stones were not found according to the specified signs')

            except Exception as ex:
                messages.error(request, f'An error occurred while working with the file')

        return super().post(request, *args, **kwargs)

    # <-- GET
    def get(self, request, *args, **kwargs):

        permission = Inspector(request)
        if not permission.auth:
            return redirect(reverse_lazy('signin'))
        elif permission.auth and not permission.has_permission(['vendors.view_vedor_diamond_model', 'vendors.add_vedor_diamond_model']):
                return redirect(reverse_lazy('403'))

        return super().get(request, *args, **kwargs)

# <-- download white template 
def download(request, path):
    file_path = os.path.join(settings.MEDIA_ROOT, path)
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type="application/vnd.ms-excel")
            response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
            return response
    raise Http404