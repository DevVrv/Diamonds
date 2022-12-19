import os, sys
import logging
import requests
import hashlib
import socket

sys.path.append('/home/arcane/.local/lib/python3.8/site-packages')


from pyftpdlib.authorizers import DummyAuthorizer, AuthenticationFailed
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer
from django.core.management import BaseCommand


FTP_IP = '68.178.206.189'
FTP_PORT = '21'

cfg = '/home/arcane/diamonds/core/ftp/config/ftp_config.cfg'
ftp_folders = '/home/arcane/diamonds/core/ftp/ftp_folders'
ftpd_log_path = '/home/arcane/diamonds/core/ftp/log/ftpd.log'
perm = 'elradfmw'

request_url = 'http://b2b.labrilliante.com/ftp/'

# =========================================== #
def request(user):
    req = requests.get(f'{request_url}{user}/')
    return req

# ftp server preparing + add user list to autorizer
def ftp_server(autorizer):
    user_list = get_users_list(cfg)
    for user in user_list:
        name, password,  = user
        homedir = ftp_folders + f'/{name}'
        try:
            autorizer.add_user(name, password, homedir=homedir, perm=perm)
        except Exception as e:
            print(e)

# get FTP users from cfg
def get_users_list(userfile):
    # Define a list of users
    user_list = []
    with open(userfile) as f:
        for line in f:
            if not line.startswith('#') and line:
                user_list.append(line.split())
    return user_list

# get ftp user from cfg
def get_ftp_user(username):
    name = username
    with open(cfg) as f:
        for line in f:
            if line.startswith(name):
                return line.split()
        return None

# add new ftp user in cfg
def add_ftp_user(user_info):
    with open(cfg, 'r') as fp:
        lines = []
        for line in fp:
            lines.append(line)
    with open(cfg, 'w') as fp:
        lines.insert (0, str (user_info) + '\n')
        s = ''.join(lines)
        fp.write(s)

# del ftp user from cfg
def del_ftp_user(username):
    with open(cfg, 'r') as r:
        lines = r.readlines()
    with open(cfg, 'w') as w:
        for l in lines:
            if not l.startswith(username):
                w.write(l)

# FTP My Aytorizer
class MyDummyAuthorizer(DummyAuthorizer):

    def validate_authentication(self, username, password, handler):
        """
            Raises AuthenticationFailed if supplied username and
            password don't match the stored credentials, else return
            None.
        """
        msg = "Authentication failed"
        if not self.has_user(username):
            if username == 'anonymous':
                msg = "Anonymous access not allowed."
            raise AuthenticationFailed(msg)
            
        if username != 'anonymous':
            received_pass = hashlib.md5(password.encode('utf-8')).hexdigest()
            if self.user_table[username]['pwd'] != received_pass:
                raise AuthenticationFailed(msg)
            
# FTP Handler
class MyHandler(FTPHandler):
    """
        Callback methods
    """

    def on_connect(self):
        print("%s:%s connected" % (self.remote_ip, self.remote_port))

    def on_disconnect(self):
        # do something when client disconnects
        print('disconect')

    def on_login(self, username):
        # do something when user login
        pass

    def on_logout(self, username):
        # do something when user logs out
        print('logout')
        

    def on_file_sent(self, file):
        # do something when a file has been sent
        pass

    def on_file_received(self, file):
        # do something when a file has been received
        responce = request(self.username)

    def on_incomplete_file_sent(self, file):
        # do something when a file is partially sent
        pass

    def on_incomplete_file_received(self, file):
        # remove partially uploaded files
        os.remove(file)

# FTP start server
class Command(BaseCommand):
    def handle(self, *args, **options):
        """
            To achieve the main logic, start ftp service
            :param args:
            :param options:
            :return:
        """
        
        handler = MyHandler
        authorizer = MyDummyAuthorizer()
        # logging.basicConfig(level=logging.DEBUG, filename=ftpd_log_path)
        handler.authorizer = authorizer
        ftp_server(authorizer)
        server = FTPServer((FTP_IP, FTP_PORT), handler)
        server.serve_forever()

# --> server runer
if __name__ == '__main__':
    command = Command()
    command.handle()


