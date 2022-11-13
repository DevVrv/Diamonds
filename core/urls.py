from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('users.urls')),
    path('filter/', include('filter.urls')),
    path('orders/', include('orders.urls')),
    path('share/', include('share.urls')),
    path('cart/', include('cart.urls')),
]
