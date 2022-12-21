import os, json

from django.http import HttpResponse
from django.middleware.csrf import get_token
from django.contrib.auth.hashers import check_password

from vendors.csv_reader import Reader_CSV
from users.models import CustomUser
from .ftp_server import ftp_folders

# FTP CSV 
def ftp_csv(request, username):
    
    curent_file = ''
    responce_message = ''

    for file in os.listdir(f'{ftp_folders}\\{username}'):
        if file.endswith('.csv'):
            curent_file = f'{ftp_folders}\\{username}\\{file}'
            csv = Reader_CSV()
            responce_message = csv.ftp_file(username, curent_file)
            responce_message = responce_message
        else:
            file_path = f'{ftp_folders}\\{username}\\{file}'
            os.remove(file_path)
            responce_message = 'File is not CSV'
            
    
    return HttpResponse(content=json.dumps(responce_message), content_type="application/json")

# FTP Autorizer
def ftp_autorizer(request, username):
    responce = None
    if request.method == 'POST':
        values = json.loads(request.body)
        try:
            user = CustomUser.objects.get(username=values['username'])
            if user.check_password(values['password']):
                responce = True
            else:
                responce = False
        except:
            pass
    
    elif request.method == 'GET':
        responce = get_token(request)
    return HttpResponse(content=json.dumps(responce), content_type="application/json")
