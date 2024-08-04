from typing import Dict

from django.shortcuts import render, get_object_or_404
from django.views.generic import TemplateView, DetailView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ProductSerializer

from catalog.models import Category, Product


class CatalogView(TemplateView):
    template_name = 'catalog/catalog.html'

    def get_context_data(self, **kwargs) -> Dict:
        context: Dict = super().get_context_data(**kwargs)
        context.update({
            'title': 'Каталог камня для изделий. Выбирайте камень и из него мы изготовим ваше изделие.',
            'categories': Category.objects.all(),
        })
        return context


class GetItemsApi(APIView):
    def get(self, request: Request, item_pk: int) -> Response:
        category = Category.objects.get(pk=item_pk)
        products = Product.objects.filter(category=category)
        serializer = ProductSerializer(products, many=True)
        count = Product.objects.count()
        return Response({
            'category': category.name,
            'data': serializer.data,
            'count': count
        })


class ProductDetailView(DetailView):
    template_name = 'catalog/product_detail.html'
    model = Product

    def get_object(self, queryset=None) -> Product:
        return get_object_or_404(Product, pk=self.kwargs['pk'])

    def get_context_data(self, **kwargs) -> Dict:
        context: Dict = super().get_context_data(**kwargs)
        object = self.get_object()
        context.update({
            'title': f'{object.category.name} {object.name} - Эстетика камня',
        })
        return context