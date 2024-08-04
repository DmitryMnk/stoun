import os

from django.db import models


def get_service_image_path(instance, filename):
    return os.path.join(
        'service',
        instance.category.name,
        filename
    )


class ServiceCategory(models.Model):
    name = models.CharField(max_length=50, verbose_name='Название')


class Service(models.Model):
    name = models.CharField(max_length=50, verbose_name='Название')
    category = models.ForeignKey(ServiceCategory, verbose_name='Категория', on_delete=models.PROTECT)
    slug = models.SlugField(verbose_name='URL', unique=True)
    image = models.ImageField(verbose_name='Изображение', upload_to=get_service_image_path)
    description = models.TextField(verbose_name='Описание')
