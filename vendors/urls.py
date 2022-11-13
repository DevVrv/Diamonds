from django.urls import path
from .views import diamonds_data, diamonds_white, CreateVendor

urlpatterns = [

    # * -------------------------------------------------------------------- Upload new diamonds
    path('white/', diamonds_white, name='white'),

    # * -------------------------------------------------------------------- Upload diamonds data
    path('data/', diamonds_data, name='round_pear'),

    # * -------------------------------------------------------------------- create vendor
    path('create/', CreateVendor.as_view(), name='create_vendor'),

]

