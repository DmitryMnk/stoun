import os

from django.db import models
from django.urls import reverse


def get_prod_image_path(instance, filename):
    return os.path.join(
        'products',
        instance.category.name,
        filename
    )


class Category(models.Model):
    name = models.CharField(max_length=20, verbose_name='Категория')
    image = models.ImageField(verbose_name='Изображение', upload_to='categories/')

    class Meta:
        db_table: str = 'category'
        verbose_name: str = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=50, verbose_name='Наименование')
    category = models.ForeignKey(Category, verbose_name='Тип материала', on_delete=models.PROTECT)
    color = models.CharField(max_length=30, verbose_name='Цвет')
    country = models.CharField(max_length=50, verbose_name='Страна')
    description = models.TextField(verbose_name='Описание')
    image = models.ImageField(verbose_name='Изображение', upload_to=get_prod_image_path)
    slug = models.SlugField(verbose_name='URL', unique=True, blank=True, null=True)

    class Meta:
        db_table: str = 'product'
        verbose_name: str = 'Товар'
        verbose_name_plural = 'Товары'

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('stoun', kwargs={'pk': self.pk})
