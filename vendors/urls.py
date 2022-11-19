from django.urls import path
from .views import White, RoundPear

urlpatterns = [

    # * -------------------------------------------------------------------- Upload new diamonds
    path('white/', White.as_view(), name='white'),

    # * -------------------------------------------------------------------- Upload diamonds data
    path('round_pear/', RoundPear.as_view(), name='round_pear'),

]

