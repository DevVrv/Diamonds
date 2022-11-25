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
            # message more info
            num_created = 0
            num_exists = 0
            num_error = 0
            rejected_rows = []
            
            # read file
            file = request.FILES['csv']
            decoded_file = file.read().decode('utf-8').splitlines()
            reader = csv.DictReader(decoded_file, delimiter=",")

            # create keys and stones
            stones = []
            diamonds = []
            string_keys = [
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
                'Girdle Condition',
                'Fluorescence Intensity',
                'Measurements',
                'Lab',
                'Image Link',
                'Video Link',
            ]
            nums_keys = [
                'Price',
                'Total Price',
                'Weight',
                'Discount Percent',
                'Measurements Length',
                'Measurements Width',
                'Measurements Depth',
                'Table Percent',
                'Depth Percent',
            ]
            
            # <-- get rows
            try:
                for index, row in enumerate(reader):
                    
                    # new diaomond 
                    stone = {}
                    missing = []
                    rejected = False

                    # get string field
                    for key in string_keys:
                        if key in row:
                            stone[key] = row[key]
                        else:
                            missing.append(key)
                    
                    # get num field
                    for key in nums_keys:

                        if key in row:

                            if row[key] == '':
                                stone[key] = 0
                                continue

                            num = row[key]
                            if num.find(','):
                                num = num.replace(',', '.')
                            
                            try:
                                num = float(num)
                            except:
                                rejected = True

                            stone[key] = num
                        else:
                            missing.append(key)
                    
                    # has missing filds
                    if missing:
                        messages.error(request, f'Error! missing fields: {missing}')
                        return self.get(request, *args, **kwargs)
                    elif rejected:
                        rejected_rows.append(index)
                        continue
                    else:
                        stones.append(stone)
                        
            except Exception as ex:
                messages.error(request, f'Something was wrong: {ex}')
                return self.get(request, *args, **kwargs)

            # diamonds format regulation
            for stone in stones:
                diamond = {
                    'ref': stone['Stock #'],
                    'cert_number': stone['Certificate #'],
                    'shape': stone['Shape'],
                    'clarity': stone['Clarity'],
                    'color': stone['Color'],
                    'culet': stone['Culet Condition'],
                    'cut': stone['Cut Grade'],
                    'polish': stone['Polish'],
                    'symmetry': stone['Symmetry'],
                    'girdle': stone['Girdle Condition'],
                    'fluor': stone['Fluorescence Intensity'],
                    'measurements': stone['Measurements'],
                    'lab': stone['Lab'],
                    'photo': stone['Image Link'],
                    'video': stone['Video Link'],

                    'rap_1ct': round(stone['Price'], 2),
                    'sale_price': round(stone['Total Price'] * stone['Weight'], 2),
                    'disc': round(stone['Discount Percent'], 2),
                    'weight': round(stone['Weight'], 2),
                    'length_mm': round(stone['Measurements Length'], 2),
                    'width': round(stone['Measurements Width'], 2),
                    'depth': round(stone['Measurements Depth'], 2),
                    'depth_procent': round(stone['Depth Percent'], 2),
                    'table_procent': round(stone['Table Percent'], 2),
                    'lw': round(stone['Measurements Length'] / stone['Measurements Width'], 2),
                    'vendor': request.user
                }
                diamonds.append(diamond)

            # -- diamonds create
            filter_diamonds = Diamond_Model.objects.all()
            vendor_diamonds = Vedor_Diamond_Model.objects.all()
            for diamond in diamonds:
                if filter_diamonds.filter(cert_number=diamond['cert_number']).exists() or vendor_diamonds.filter(cert_number=diamond['cert_number']).exists():
                        num_exists += 1
                        continue
                else:
                    try:
                        vendor_diamonds.create(**diamond)
                        num_created += 1
                    except Exception as ex:
                        print(ex)
                        num_error += 1
                        continue
            
            # messages
            if num_created:
                messages.success(request, 'The data was uploaded successfully')
                messages.info(request, f'Was created: {num_created} | Alredy existed: {num_exists}')
            elif not num_created and num_exists:
                messages.warning(request, 'All the presented stones have already been uploaded to the site')

            if num_error:
                messages.error(request, f'Error, some stones was not created: {num_error}')
            
            if rejected_rows:
                messages.error(request, f'Some stones bin rejected, was stones data is wrong! Rejected rows: {rejected_rows}')

            return self.get(request, *args, **kwargs)

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
           
            ps_diamonds = None
            br_diamonds = None

            # -- decode and read file
            file = request.FILES['csv'] 
            decoded_file = file.read().decode('utf-8').splitlines()
            reader = csv.reader(decoded_file, delimiter=";")

            br = 0
            ps = 0
            else_type = 0
            updated = 0
            diamonds_all = Diamond_Model.objects.all()

            br_values = []
            ps_values = []

            try:
                for row in reader:
                    for value in row:
                        values = value.split(',')
                        
                        if values[0] == 'BR':
                            br+=1
                            br_values.append(values)
                        elif values[0] == 'PS':
                            ps+=1
                            ps_values.append(values)
                        else:
                            else_type+1

                if br_values:
                    br_diamonds = diamonds_all.filter(shape='Round')
                
                if ps_values:
                    ps_diamonds = diamonds_all.exclude(shape='Round')

                if br_diamonds:
                    for value in br_values:
                        file_clarity = value[1]
                        file_color = value[2]
                        file_weight_from = float(value[3])
                        file_weight_to = float(value[4])
                        file_rap_1ct = float(value[5])

                        for diamond in br_diamonds:
                            if diamond.clarity == file_clarity and diamond.color == file_color:
                                if file_weight_from <= diamond.weight and file_weight_to >= diamond.weight:
                                    diamond.rap_1ct = file_rap_1ct
                                    rap_price = round(diamond.rap_1ct * diamond.weight, 2)
                                    diamond.disc = round((diamond.sale_price / rap_price) * 1, 2)
                                    diamond.save()
                                    
                                    updated += 1
                                    
                if ps_diamonds:
                    for value in ps_values:
                        file_clarity = value[1]
                        file_color = value[2]
                        file_weight_from = float(value[3])
                        file_weight_to = float(value[4])
                        file_rap_1ct = float(value[5])

                        for diamond in ps_diamonds:
                            if diamond.clarity == file_clarity and diamond.color == file_color:
                                if file_weight_from <= diamond.weight and file_weight_to >= diamond.weight:
                                    diamond.rap_1ct = file_rap_1ct
                                    rap_price = round(diamond.rap_1ct * diamond.weight, 2)
                                    diamond.disc = (diamond.sale_price / rap_price) * 1
                                    diamond.save()
                                    
                                    updated += 1

                if updated:
                    messages.success(request, f'Diamonds was updated: {updated}')
                else:
                    messages.warning(request, f'Stones with the specified characteristics were not found, check your file for the correctness of the data')
            except Exception as ex:
                print(ex)
                messages.error(request, 'An error occurred while working with the document')

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

# # -- round / pear
# class RoundPear(FormView):
#     template_name = 'round_pear.html'
#     form_class = UploadCSVForm
#     success_url = reverse_lazy('round_pear')
#     extra_context = {
#         'title': 'Round / Pear',
#         'has_permission': False
#     }

#     # --> POST
#     def post(self, request, *args, **kwargs):
#         form = self.form_class(request.POST, request.FILES)
        
#         if form.is_valid():
#             try:
#                 # -- decode and read file
#                 file = request.FILES['csv'] 
#                 decoded_file = file.read().decode('utf-8').splitlines()
#                 reader = csv.reader(decoded_file, delimiter=";")

#                 # -- get diamonds list 
#                 br = 0
#                 ps = 0
#                 else_type = 0
#                 diamonds_all = Diamond_Model.objects.all()
#                 for row in reader:
#                     for value in row:
#                         values = value.split(',')
#                         if values[0] == 'BR':
#                             br+=1
#                         elif values[0] == 'PS':
#                             ps+=1
#                         else:
#                             else_type+1
#                 if not else_type and not ps and br:
#                     diamonds = diamonds_all.filter(shape='Round')
#                 elif not else_type and not br and ps:
#                     diamonds = diamonds_all.exclude(shape='Round')
#                 else:
#                     messages.error(request, 'Incorrect file data format')
#                     return redirect(self.success_url)

#                 # -- new values for diamonds
#                 new_diamonds_values = []

#                 # --> read file rows
#                 for row in reader:
#                     print(1234)
#                     for item in row:
#                         values = item.split(',')
#                         file_clarity = values[1]
#                         file_color = values[2]
#                         file_weight_from = float(values[3])
#                         file_weight_to = float(values[4])
#                         file_rap_1ct = float(values[5])

#                         print(f'{file_color}, {file_clarity}')
#                         print(f'{diamond.color}, {diamond.clarity}')

#                         for diamond in diamonds:
#                             diamond_weight = float(diamond.weight)
#                             if file_clarity == diamond.clarity and file_color == diamond.color:
#                                 if file_weight_from <= diamond_weight and file_weight_to >= diamond_weight:
#                                     new_diamond = {
#                                         'rap_1ct': file_rap_1ct,
#                                         'rap_price': file_rap_1ct * diamond_weight,
#                                         'disc': round(diamond.sale_price/diamond.rap_price, 2)
#                                     }
#                                     new_diamonds_values.append(new_diamond)
                
#                 for diamond in diamonds:
#                     for new_values in new_diamonds_values:
#                         if diamond.cert_number == new_values.cert_number:
#                             diamond.rap_1ct = new_values.rap_1ct
#                             diamond.rap_price = new_values.rap_price
#                             diamond.disc = new_values.disc
#                             diamond.save()

#                 # -- updated len
#                 updated = len(new_diamonds_values)

#                 # -- success
#                 if updated != 0:
#                     messages.success(request, f'Successfully, {updated} diamonds was updated')
#                 else:
#                     messages.warning(request, f'The stones were not found according to the specified signs')

#             except Exception as ex:
#                 print(ex)
#                 messages.error(request, f'An error occurred while working with the file')

#         return super().post(request, *args, **kwargs)

#     # <-- GET
#     def get(self, request, *args, **kwargs):

#         permission = Inspector(request)
#         perm_list = ['vendors.view_vedor_diamond_model', 'vendors.add_vedor_diamond_model', 'vendors.change_vedor_diamond_model']

#         if not permission.auth:
#             return redirect(reverse_lazy('signin'))
        
#         if not permission.super or not permission.staff and permission.has_permissions(perm_list):
#             raise PermissionDenied()

#         if permission.super or permission.staff and permission.has_permissions(perm_list):
#             self.extra_context['has_permission'] = True

#         return super().get(request, *args, **kwargs)
