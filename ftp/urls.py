from django.urls import path
from .views import ftp_csv, ftp_autorizer

urlpatterns = [
    path('<username>/', ftp_csv, name='csv_responce'),
    path('validation/<username>/', ftp_autorizer, name='ftp_validation'),
]
