from django.urls import path
from .views import create_share, get_share

urlpatterns = [

    # @ Create share model
    path('create/', create_share, name='share_create'),

    # @ Get share page
    path('get/<user_id>/<share_id>/<share_key>/', get_share, name='share_get'),

]
