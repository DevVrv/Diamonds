from django.urls import path
from .views import csv_responce, ftp_autorizer

urlpatterns = [
    path('<username>/', csv_responce, name='csv_responce'),
    path('validation/<username>/', ftp_autorizer, name='ftp_validation'),
]
