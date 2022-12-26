from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('users.urls')),
    path('vendor/', include('vendors.urls')),
    path('filter/', include('filter.urls')),
    path('share/', include('share.urls')),
    path('cart/', include('cart.urls')),
    path('orders/', include('orders.urls')),
    path('ftp/', include('ftp.urls')),
    path('mail/', include('mail.urls')),
]
