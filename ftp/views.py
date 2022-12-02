import os
from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer



class FTP(object):

    def __init__(self, address = '127.0.0.1', port = '21'):

        self.address = address
        self.port = port

    def create_user(self, username = str, password = str, basedir = '.'):

        self.autorizer.add_user(username, password, basedir, perm='elradfmwMT')
        self.autorizer.add_anonymous(os.getcwd())  

    def start_server(self):

        self.autorizer = DummyAuthorizer()

        handler = FTPHandler
        handler.authorizer = self.autorizer

        handler.banner = "pyftpdlib based ftpd ready."

        address = (self.address, self.port)
        server = FTPServer(address, handler)

        server.max_cons = 256
        server.max_cons_per_ip = 5
        server.serve_forever()


ftp = FTP()
ftp.start_server()