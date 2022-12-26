from django.urls import path
from .views import send_mail_to_manager

urlpatterns = [
    path('to/manager/', send_mail_to_manager, name='send_mail_to_manager')
]
