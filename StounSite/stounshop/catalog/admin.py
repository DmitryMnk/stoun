from django.contrib import admin
from .models import *


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = 'name',
    ordering = 'name',


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = 'pk', 'name', 'category', 'color', 'country'
    list_display_links = 'pk', 'name', 'category'
    ordering = 'category', 'name', 'pk'
    search_fields = 'name', 'category'
