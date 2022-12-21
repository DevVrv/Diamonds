import json
import logging
import requests
import os

from datetime import date
from pyftpdlib.authorizers import DummyAuthorizer, AuthenticationFailed
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import ThreadedFTPServer

# =========================================== #

perm = 'elradfmw'
ftpd_log_path = 'A:\code\Current\dj\core\\ftp\\log\\ftpd.log'
ftp_folders = 'A:\code\Current\dj\core\\ftp\\ftp_folders'
request_url = 'http://127.0.0.1:8000/ftp'

# =========================================== #

# csv request 
def csv_request(user):
    responce = requests.get(f'{request_url}/{user}/')
    return responce

# validation request
def validation_request(username, password):

    # create token 
    url = f'{request_url}/validation/{username}/'
    get_request = requests.get(url)
    get_request_content = json.loads(get_request.content)
    
    # send request
    token = get_request_content
    data = {'username': username, 'password': password}
    header = {'X-CSRFToken': token}
    cookies = {'csrftoken': token}
    responce = requests.post(f'{url}', data=json.dumps(data), headers=header, cookies=cookies)
    return responce

# personal logging
def personal_logging(username, content):
    personal_file = f'{ftp_folders}\{username}\personal.log'
    try:
        file = open(personal_file, 'w+')
        current_date = str(date.today())
        if content['created']:
            msg = content['created']['msg']
            value = content['created']['value']
            file.write(f'User: {username}, date: {current_date}, info - {msg}{value} \n')

        if content['error']:
            msg = content['error']['msg']
            value = content['error']['value']
            file.write(f'User: {username}, date: {current_date}, info - {msg}{value} \n')

        if content['exists']:
            msg = content['exists']['msg']
            value = content['exists']['value']
            file.write(f'User: {username}, date: {current_date}, info - {msg}{value} \n')

        if content['rejected']:
            msg = content['rejected']['msg']
            value = content['rejected']['value']
            file.write(f'User: {username}, date: {current_date}, info - {msg}{value} \n')

        if content['missing']:
            msg = content['missing']['msg']
            value = content['missing']['value']
            file.write(f'User: {username}, date: {current_date}, info - {msg}{value} \n')

        file.close()   
    finally:
        file.close()

# FTP authorizer
class Authorizer(DummyAuthorizer):
    def validate_authentication(self, username, password, handler):
        msg = "Authentication failed."
        if not self.has_user(username):
            if username == 'anonymous':
                msg = "Anonymous access not allowed."
                raise AuthenticationFailed(msg)
            elif username != 'anonymous':
                responce = json.loads(validation_request(username, password).content)           
                if responce:
                    self.add_user(username=username, password=password, homedir=f'{ftp_folders}/{username}', perm=perm)    
                else:
                    raise AuthenticationFailed(msg)

# FTP Handler 
class Handler(FTPHandler):

    # -- callback on received -- #
    def on_file_received(self, file):
        if not file.endswith('.csv'):
            os.remove(file)
            return None

        responce = csv_request(self.username)
        content = json.loads(responce.content)
        current_date = str(date.today())
        
        if content['created']:
            msg = content['created']['msg']
            value = content['created']['value']
            logging.warning(msg=f'User: {self.username}, date: {current_date}, info - {msg}{value}')
        if content['error']:
            msg = content['error']['msg']
            value = content['error']['value']
            logging.error(msg=f'User: {self.username}, date: {current_date}, info - {msg}{value}')
        if content['exists']:
            msg = content['exists']['msg']
            value = content['exists']['value']
            logging.error(msg=f'User: {self.username}, date: {current_date}, info - {msg}{value}')
        if content['rejected']:
            msg = content['rejected']['msg']
            value = content['rejected']['value']
            logging.error(msg=f'User: {self.username}, date: {current_date}, info - {msg}{value}')
        if content['missing']:
            msg = content['missing']['msg']
            value = content['missing']['value']
            logging.error(msg=f'User: {self.username}, date: {current_date}, info - {msg}{value}')
        
        personal_logging(self.username, content)

    def add_user(self, username, password):
        self.authorizer.add_user(username=username, password=password, homedir=f'{ftp_folders}/{username}', perm=perm) 

# FTP Server
class FTP_Server:

    def __init__(self):
        self.port = '21'
        self.ip = '127.0.0.1'
        self.authorizer = Authorizer()
        self.handler = Handler
        self.handler.authorizer = self.authorizer
        self.server = ThreadedFTPServer((self.ip, self.port), self.handler)

        # logger
        self.logger = logging.basicConfig(
            level=logging.INFO, 
            filename=ftpd_log_path, 
            format='%(process)d-%(levelname)s-%(message)s', 
            datefmt='%d-%b-%y %H:%M:%S')

    def start(self):
        self.server.serve_forever()

    def end(self):
        self.server.close_all()


if __name__ == '__main__':    
    server = FTP_Server()
    server.start()
    server.add_user('Roman', '12345')

    
    
    