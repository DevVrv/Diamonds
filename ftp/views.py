import os, json

from django.http import HttpResponse
from django.middleware.csrf import get_token
from django.contrib.auth.hashers import check_password

from vendors.csv_reader import Reader_CSV
from users.models import CustomUser
from .ftp_server import ftp_folders

# FTP API
def csv_responce(request, username):
    
    curent_file = ''
    responce_message = ''

    for file in os.listdir(f'{ftp_folders}\\{username}'):
        if file.endswith('.csv'):
            curent_file = f'{ftp_folders}\\{username}\\{file}'

            csv = Reader_CSV()
            responce_message = csv.ftp_file(username, curent_file)
            responce_message = json.dumps(responce_message)
        else:
            file_path = f'{ftp_folders}\\{username}\\{file}'
            os.remove(file_path)
            responce_message = 'File is not CSV'
            
    
    return HttpResponse(content=responce_message, content_type="application/json")


def ftp_autorizer(request, username):

    responce = {
        'valid': False,
        'token': ''
    }

    if request.method == 'POST':
        
        values = json.loads(request.body)
        try:
            user = CustomUser.objects.get(username=values['username'])
        except:
            pass
            

        responce['valid'] = False

    elif request.method == 'GET':
        responce['token'] = get_token(request)

    return HttpResponse(content=json.dumps(responce), content_type="application/json")