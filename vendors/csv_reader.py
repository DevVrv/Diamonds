import csv, os
from filter.models import Diamond_Model, Fancy_Diamond_Model
from .models import Vedor_Diamond_Model, Fancy_Vedor_Diamond_Model
from users.models import CustomUser
from django.contrib import messages

# import settings
import sys
import logging

# Get an instance of a logger
log_file = 'A:\\code\\Current\\dj\\core\\vendors\\log\\vendor.log'
logger = logging.getLogger(__name__)

# --> CSV file rieader
class Reader_CSV(object):

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
            'missing': 'The file does not meet the requirements, there are no required fields:',
            'rejected': 'The following stones were rejected, incorrect data:',
            'error': 'The following stones were not created, an error loading into the database:',
            'created': 'The stones were successfully created:',
            'exists': 'The stones were not created because they already exist:',
            'unexpected': 'Unexpected Exception'
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
        fancy_diamonds = []
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
            
            if diamond['color'].startswith('Fancy') or diamond['color'].startswith('fancy') or diamond['color'].startswith('Light'):
                fancy_diamonds.append(diamond);
            else:
                diamonds.append(diamond)
        return {
            'diamonds': diamonds,
            'fancy': fancy_diamonds
        }

    # uploading diamonds in db
    def _upload_diamonds(self, diamonds_list, path = 'vendor'):
        filter_diamonds = Diamond_Model.objects.all()
        fancy_filter_diamonds = Fancy_Diamond_Model.objects.all()
        vendor_diamonds = Vedor_Diamond_Model.objects.all()
        fancy_vendor_diamonds = Fancy_Vedor_Diamond_Model.objects.all()
        for diamond in diamonds_list:
            if filter_diamonds.filter(certificate=diamond['certificate']).exists() or vendor_diamonds.filter(certificate=diamond['certificate']).exists() or fancy_vendor_diamonds.filter(certificate=diamond['certificate']).exists() or fancy_filter_diamonds.filter(certificate=diamond['certificate']).exists():
                    self.x_exists += 1
                    continue
            else:
                try:
                    if path == 'vendor':
                        vendor_diamonds.create(**diamond)
                    elif path == 'fancy':
                        fancy_vendor_diamonds.create(**diamond)

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
            # get stones
            stones = self._create_stones(reader=reader)

            # get acepted and rejected stones
            self.stones_acepted = stones['acepted']
            self.stones_rejected = stones['rejected']
            
            # create diamond list
            if self.stones_acepted:
                self.full_diamonds_list = self._create_diamonds(self.stones_acepted, vendor=request.user)
                self.diamonds_list = self.full_diamonds_list['diamonds']
                self.fancy_diamonds_list = self.full_diamonds_list['fancy']
                # upload diamonds
                self._upload_diamonds(self.diamonds_list, 'vendor')
                self._upload_diamonds(self.fancy_diamonds_list, 'fancy')

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
    def ftp_file(self, username, file_path):

        self.ftp_msg= {
            'created': {},
            'error': {},
            'exists': {},
            'rejected': {},
            'missing': {}
        }

        try:
            user = CustomUser.objects.get(username=username)

            with open(file_path, encoding='utf-8') as r_file:
                reader = csv.DictReader(r_file, delimiter = ",")

                # check rows and continue if is empty
                self.missing_rows = self._check_file_rows(reader=reader)
                if not self.missing_rows:
                    # get acepted and rejected stones
                    stones = self._create_stones(reader=reader)
                    self.stones_acepted = stones['acepted']
                    self.stones_rejected = stones['rejected']
                    
                    # create diamond list
                    if self.stones_acepted:
                        self.full_diamonds_list = self._create_diamonds(self.stones_acepted, vendor=user)
                        self.diamonds_list = self.full_diamonds_list['diamonds']
                        self.fancy_diamonds_list = self.full_diamonds_list['fancy']
                        # upload diamonds
                        self._upload_diamonds(self.diamonds_list, 'vendor')
                        self._upload_diamonds(self.fancy_diamonds_list, 'fancy')

                        # messages
                        if self.x_error:
                            msg = self.messages['error']
                            self.ftp_msg['error']['msg'] = msg
                            self.ftp_msg['error']['value'] = self.x_error
                        if self.x_created:
                            msg = self.messages['created']
                            self.ftp_msg['created']['msg'] = msg
                            self.ftp_msg['created']['value'] = self.x_created
                        if self.x_exists:
                            msg = self.messages['exists']
                            self.ftp_msg['exists']['msg'] = msg
                            self.ftp_msg['exists']['value'] = self.x_exists

                    if self.stones_rejected:
                        msg = self.messages['rejected']
                        self.ftp_msg['rejected']['msg'] = msg
                        self.ftp_msg['rejected']['value'] = self.stones_rejected
                else:
                    msg = self.messages['missing']
                    self.ftp_msg['missing']['msg'] = msg
                    self.ftp_msg['missing']['value'] = self.missing_rows  
        except:
            msg = self.messages['unexpected']
            self.ftp_msg['missing']['msg'] = msg
        os.remove(file_path)
    
        return self.ftp_msg