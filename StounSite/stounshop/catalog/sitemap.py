from django.contrib.sitemaps import Sitemap

from .models import Product


class CatalogSiteMap(Sitemap):
    priority = 0.5
    changefreq = 'daily'

    def items(self):
        return Product.objects.all()


