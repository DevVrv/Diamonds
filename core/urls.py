from django.contrib import admin
from django.urls import path, include

from .views import Access_denied

urlpatterns = [
    path('', include('filter.urls')),
    path('admin/', admin.site.urls),
    path('user/', include('users.urls')),
    path('vendor/', include('vendors.urls')),
    path('share/', include('share.urls')),
    path('cart/', include('cart.urls')),
    path('orders/', include('orders.urls')),

    path('403/', Access_denied.as_view(), name='403'),
]
