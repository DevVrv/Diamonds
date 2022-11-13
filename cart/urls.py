from django.urls import path
from .views import cart, cart_sort, delete_selected, cart_pack


urlpatterns = [
    # <-- get cart template
    path('', cart, name='cart'),
    
    # * delete selected
    path('delete_selected/', delete_selected, name='cart_delete_selected'),

    # * cart sort
    path('sort/', cart_sort, name='cart_delete_selected'),

    # --> add to cart
    path('pack/', cart_pack, name='cart_pack'),

]
