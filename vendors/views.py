from django.urls import reverse_lazy
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

            file_worker = csv_reader()
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
                                    diamond.disc = round((diamond.sale_price / rap_price) * 1, 2)
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

# CSV file rieader
class csv_reader(object):

    def __init__(self):
        # enumirated actions
        self.x_rejected = 0
        self.x_created = 0
        self.x_exists = 0
        self.x_error = 0

        # keys for reader
        self.string_keys = [
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
        self.nums_keys = [
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

        # rejected and missing rows info
        self.missing_rows = []
        
        # diamonds and stones list
        self.stones_acepted = []
        self.stones_rejected = []
        self.diamonds_list = []

        # messages
        self.messages = {
            'missing': f'The file does not meet the requirements, there are no required fields:',
            'rejected': f'The following stones were rejected, incorrect data:',
            'error': f'The following stones were not created, an error loading into the database:',
            'created': f'The stones were successfully created:',
            'exists': f'The stones were not created because they already exist:',
        }

    # checking existing rows
    def _check_file_rows(self, reader):
        missing_rows = []
        for row in reader:
            for key in self.string_keys:
                if not key in row:
                    missing_rows.append(key)
            for key in self.nums_keys:
                if not key in row:
                    missing_rows.append(key)
            return missing_rows

    # create stones acepted and rejected list
    def _create_stones(self, reader):
            rejected_stones = []
            acepted_stones = []

            try:
                for index, row in enumerate(reader):
                    curent_stone = {}
                    rejected = False

                    # get str fields
                    for key in self.string_keys:
                        curent_stone[key] = row[key]

                    # get num fields
                    for key in self.nums_keys:
                        num = row[key]

                        # value is empty
                        if num == '':
                            curent_stone[key] = 0
                            continue
                        
                        # num replace ',' '.'
                        if num.find(','):
                            num = num.replace(',', '.')

                        # convert to float
                        try:
                            num = float(num)
                            curent_stone[key] = num
                        except:
                            rejected_stones.append({
                                'row': index,
                                'column': key
                            })
                            rejected = True
                            
                    if not rejected:
                        acepted_stones.append(curent_stone)    
            except Exception as ex:
                print(ex)

            return {'acepted': acepted_stones, 'rejected': rejected_stones}

    # crate diamonds list
    def _create_diamonds(self, list, vendor):
        diamonds = []
        for stone in list:
            diamond = {
                'stock': stone['Stock #'],
                'certificate': stone['Certificate #'],
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
                'vendor': vendor
            }
            diamonds.append(diamond)
        return diamonds

    # uploading diamonds in db
    def _upload_diamonds(self, diamonds_list):
        filter_diamonds = Diamond_Model.objects.all()
        vendor_diamonds = Vedor_Diamond_Model.objects.all()
        for diamond in diamonds_list:
            if filter_diamonds.filter(certificate=diamond['certificate']).exists() or vendor_diamonds.filter(certificate=diamond['certificate']).exists():
                    self.x_exists += 1
                    continue
            else:
                try:
                    vendor_diamonds.create(**diamond)
                    self.x_created += 1
                except Exception as ex:
                    print(ex)
                    self.x_error += 1
                    continue

    # --> if method POST
    def post_file(self, request):
        # file read
        file = request.FILES['csv']
        decoded_file = file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded_file, delimiter=",")

        # check rows and continue if is empty
        self.missing_rows = self._check_file_rows(reader=reader)
        if not self.missing_rows:
            # get acepted and rejected stones
            stones = self._create_stones(reader=reader)
            self.stones_acepted = stones['acepted']
            self.stones_rejected = stones['rejected']
            
            # create diamond list
            if self.stones_acepted:
                self.diamonds_list = self._create_diamonds(self.stones_acepted, vendor=request.user)
                self._upload_diamonds(self.diamonds_list)

                # messages
                if self.x_error:
                    msg = self.messages['error']
                    messages.error(request, f'{msg} {self.x_error}')
                if self.x_created:
                    msg = self.messages['created']
                    messages.success(request, f'{msg} {self.x_created}')
                if self.x_exists:
                    msg = self.messages['exists']
                    messages.warning(request, f'{msg} {self.x_exists}')
                
            if self.stones_rejected:
                msg = self.messages['rejected']
                messages.error(request, f'{msg} {self.stones_rejected}')
        else:
            msg = self.messages['missing']
            messages.error(request, f'{msg} {self.missing_rows}')

    # --> FTP file
    def ftp_file(self):
        pass