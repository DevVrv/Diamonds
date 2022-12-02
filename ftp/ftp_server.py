import os
from core.settings import FTP_IP, FTP_PORT
from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer, MultiprocessFTPServer, ThreadedFTPServer
from django.core.management import BaseCommand


current_path = os.getcwd()
user_cfg_path = os.path.join(current_path, 'core/ftp/config/ftp_config.cfg')

class MyHandler(FTPHandler):
    """
    Callback method
    """
    def on_connect (self): # When link call
        ftp_server(self.authorizer)
        print("%s:%s connected" % (self.remote_ip, self.remote_port))


class Command(BaseCommand):
    def handle(self, *args, **options):
        """
        To achieve the main logic, start ftp service
        :param args:
        :param options:
        :return:
        """
        authorizer = DummyAuthorizer()
        handler = MyHandler
        handler.authorizer = authorizer
        ftp_server(authorizer)
        # server = FTPServer(("0.0.0.0", 2121), handler)
        # server = MultiprocessFTPServer(("0.0.0.0", 2121), handler)
        server = ThreadedFTPServer((FTP_IP, FTP_PORT), handler)
        server.serve_forever()
 

def get_user(userfile):
    # Define a list of users
    user_list = []
    with open(userfile) as f:
        for line in f:
            if not line.startswith('#') and line:
                if len(line.split()) == 6:
                    # print(line.split())
                    user_list.append(line.split())
                else:
                    print ( "user.conf configuration error")
    return user_list
 
 
def ftp_server(authorizer):
    # Adding user permissions and path parameters in parentheses (user name, password, user directories, permissions)
    # authorizer.add_user('user', '12345', '/home/', perm='elradfmw')
    user_list = get_user(user_cfg_path)
    for user in user_list:
        name, passwd, permit, homedir, date, time = user
        try:
            authorizer.add_user(name, passwd, homedir, perm=permit)
        except Exception as e:
            print(e)
 

def get_ftp_user(username):
    name = username
    with open(user_cfg_path) as f:
        for line in f:
            print(f)
            if line.startswith(name):
                return line.split()

        return None

 
def del_ftp_user(username):
    with open(user_cfg_path, 'r') as r:
        lines = r.readlines()
    with open(user_cfg_path, 'w') as w:
        for l in lines:
            if not l.startswith(username):
                w.write(l)
 
 
def add_ftp_user(user_info):
    with open(user_cfg_path, 'r') as fp:
        lines = []
        for line in fp:
            lines.append(line)
    with open(user_cfg_path, 'w') as fp:
        lines.insert (0, str (user_info) + '\ n') # inserted in the first row
        s = ''.join(lines)
        fp.write(s)
 