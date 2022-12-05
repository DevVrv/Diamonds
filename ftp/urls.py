from django.urls import path
from .views import ftp_responce

urlpatterns = [
    path('<username>/', ftp_responce, name='ftp_responce')
]
