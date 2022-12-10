from django.urls import path
from .views import *

urlpatterns = [
    path('', get_orders, name='orders'),
    path('create/', create_order, name='order_create'),
    path('details/', get_order_details, name='order_details'),
    path('search/', order_search, name='order_search'),
    path('remove/', order_remove, name='order_remove'),

]
