from django.urls import path
from .views import ftp_responce

urlpatterns = [
    
    path('search/', ftp_responce, name='ftp_responce')

]
