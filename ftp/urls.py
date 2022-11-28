from django.urls import path
from .views import *

urlpatterns = [
    path('', ftp_connection, name='white'),
]

