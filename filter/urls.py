from django.urls import path
from .views import filterPage, filtering_of_key, filtering

urlpatterns = [

    # @ Get filter page
    path('', filterPage, name='filter'),

    # @ Filtering Ajax
    path('filtering/', filtering, name='filtering'),

    # @ Filtering Ajax of key
    path('filtering/of/key/', filtering_of_key, name='filtering_of_key'),

]
