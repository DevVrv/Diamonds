import os, json
from django.http import HttpResponse
from vendors.csv_reader import Reader_CSV
from .ftp_server import ftp_folders

# FTP API
def ftp_responce(request, username):
    
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