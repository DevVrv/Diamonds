from django.core.exceptions import PermissionDenied
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
        'has_permission': False
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
            
            sting_keys = [
                'Stock #',
                'Certificate #',
                'Shape',
                'Clarity',
                'Color',
                'Culet Condition',
                'Cut Grade',
                'Polish',
                'Symmetry',
                'Culet Condition',
                'Fluorescence Intensity',
                'Measurements',
                'Lab',
                'Image Link',
                'Video Link',
            ]

            try:
                for row in reader:



                    return redirect(self.success_url)

                    # make new diamond
                    # diamond = {
                    #     'ref': row['Stock #'],
                    #     'vendor_id': request.user.id,
                    #     'cert_number': row['Certificate #'],

                    #     'shape': row['Shape'],
                    #     'clarity': row['Clarity'],
                    #     'color': row['Color'],

                    #     'rap_1ct': float(row['Price'].replace(',', '.')),
                    #     'sale_price': float(row['Total Price'].replace(',', '.')),
                    #     'disc': disc,
                        
                    #     'girdle': row['Girdle Condition'],
                    #     'culet': row['Culet Condition'],
                    #     'weight': row['Weight'],
                    #     'cut': row['Cut Grade'],
                    #     'polish': row['Polish'],
                    #     'symmetry': row['Symmetry'],
                    #     'culet': row['Culet Condition'],
                    #     'fluor': row['Fluorescence Intensity'],
                    #     'length': row['Measurements Length'],
                    #     'width': row['Measurements Width'],
                    #     'depth': row['Measurements Depth'],
                    #     'lw': round(float(row['Measurements Length']) / float(row['Measurements Width'])),
                    #     'measurements': measurements,
                    #     'lab': row['Lab'], 

                    #     'depth_procent': row['Depth Percent'],
                    #     'table_procent': row['Table Percent'],
                    #     'photo': row['Image Link'],
                    #     'video': row['Video Link'],
                    # }
                    # diamonds.append(diamond)
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
        perm_list = ['vendors.view_vedor_diamond_model', 'vendors.add_vedor_diamond_model', 'vendors.change_vedor_diamond_model']

        if not permission.auth:
            return redirect(reverse_lazy('signin'))

        if not permission.type == 2 and not permission.super and not permission.has_permissions(perm_list):
            raise PermissionDenied()

        if permission.super or permission.staff and permission.has_permissions(perm_list):
            self.extra_context['has_permission'] = True

        return super().get(request, *args, **kwargs)

# -- round / pear
class RoundPear(FormView):
    template_name = 'round_pear.html'
    form_class = UploadCSVForm
    success_url = reverse_lazy('round_pear')
    extra_context = {
        'title': 'Round / Pear',
        'has_permission': False
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
        perm_list = ['vendors.view_vedor_diamond_model', 'vendors.add_vedor_diamond_model', 'vendors.change_vedor_diamond_model']

        if not permission.auth:
            return redirect(reverse_lazy('signin'))
        
        if not permission.super or not permission.staff and permission.has_permissions(perm_list):
            raise PermissionDenied()

        if permission.super or permission.staff and permission.has_permissions(perm_list):
            self.extra_context['has_permission'] = True

        return super().get(request, *args, **kwargs)

