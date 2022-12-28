from django.urls import reverse_lazy
from django.contrib import messages
from users.inspector import Inspector

from django.views.generic import FormView

from .forms import UploadCSVForm
import csv

from filter.models import Diamond_Model

from .csv_reader import Reader_CSV

# import the logging library
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)

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

            file_worker = Reader_CSV()
            file_worker.post_file(request)

            return self.get(request, *args, **kwargs)

        return super().post(request, *args, **kwargs)

    # <-- GET
    def get(self, request, *args, **kwargs):
        # -- permissions
        permission = Inspector(request)
        permission_list = ['vendors.view_vedor_diamond_model', 'vendors.add_vedor_diamond_model', 'vendors.change_vedor_diamond_model']
        permission.has_permissions(permission_list)
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
                        file_price_per_ct = float(value[5])

                        for diamond in br_diamonds:
                            if diamond.clarity == file_clarity and diamond.color == file_color:
                                if file_weight_from <= diamond.weight and file_weight_to >= diamond.weight:
                                    diamond.price_per_ct = file_price_per_ct
                                    diamond.rap_price = round(diamond.price_per_ct * diamond.weight, 2)
                                    diamond.rap_disc = round((diamond.sale_price / diamond.rap_price - 1) * 100, 2)
                                    diamond.save()
                                    
                                    updated += 1
                                    
                if ps_diamonds:
                    for value in ps_values:
                        file_clarity = value[1]
                        file_color = value[2]
                        file_weight_from = float(value[3])
                        file_weight_to = float(value[4])
                        file_price_per_ct = float(value[5])

                        for diamond in ps_diamonds:
                            if diamond.clarity == file_clarity and diamond.color == file_color:
                                if file_weight_from <= diamond.weight and file_weight_to >= diamond.weight:
                                    diamond.price_per_ct = file_price_per_ct
                                    diamond.rap_price = round(diamond.price_per_ct * diamond.weight, 2)
                                    diamond.rap_disc = round((diamond.sale_price / diamond.rap_price - 1) * 100, 2)
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
        permission_list = ['vendors.view_vedor_diamond_model', 'vendors.add_vedor_diamond_model', 'vendors.change_vedor_diamond_model']
        permission.has_permissions(permission_list)
        self.extra_context['has_permission'] = True

        return super().get(request, *args, **kwargs)


