from django.urls import path
from .views import *

urlpatterns = [
    path('', CatalogView.as_view(), name='catalog'),
    path('api/get_items/<int:item_pk>', GetItemsApi.as_view()),
    path('камень/<int:pk>', ProductDetailView.as_view(), name='stoun')
]