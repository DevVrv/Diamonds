from ftplib import FTP

def ftp_connection(request):

    HOST = '68.178.206.189'
    USER = 'arcane'
    PASSWORD = 'Gettog02!'
    PORT = '21'

    ftp = FTP(HOST, USER, PASSWORD)

    ftp.connect(HOST, PORT)

