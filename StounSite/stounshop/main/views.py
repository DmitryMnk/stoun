from django.http import HttpResponseNotFound
from django.shortcuts import render
from django.views.generic import TemplateView

from catalog.models import Category


class MainView(TemplateView):
    template_name = 'main/main.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update({
            'title': 'Эстетика камня - Изделия из натурального камня любой сложности.',
            'categories': Category.objects.all(),
        })

        return context


class PortfolioView(TemplateView):
    template_name = 'main/portfolio.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update({
            'title': 'Эстетика камня - Портфолио наших работ из натурального камня.',
        })

        return context


class AboutView(TemplateView):
    template_name = 'main/about.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update({
            'title': 'Эстетика камня - О нас.',
        })

        return context


class ContactsView(TemplateView):
    template_name = 'main/contacts.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update({
            'title': 'Контакты - Эстетика камня',
        })

        return context


def page_not_found_view(request, exception):
    return render(request, '404.html', status=404)
