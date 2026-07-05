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
            'description': 'Изделия из натурального или искусственного камня г. Астрахань. Столешницы, '
                           'лестницы, раковины, камины, панно, плитка, фонтаны и многое другое из натурального камня. '
                           'Изготавливаем изделия любой сложности под заказ, собственный цех в г. Астрахань. Доставка '
                           'по всей России. Широкий ассортимент мрамора, гранита, оникса и других видов камня для ваших'
                           ' изделий. Имеем собственное производство, более 15 лет на рынке и тысячи заказов по всей '
                           'России. Интерьер, экстерьер, ландшафт. Для дома и бизнеса. Гарантия на изделия. Звоните! '
                           'Работаем: ежедневно 8:00-19:00 вс-выходной'
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
            'description': 'Более 15 лет мы занимаемся изготовлением изделий из натурального камня. Столешницы, '
                           'лестницы, раковины, камины, панно, плитка, фонтаны и многое другое из натурального камня. '
                           'Изготавливаем изделия любой сложности под заказ, собственный цех в г. Астрахань. Доставка '
                           'по всей России. Широкий ассортимент мрамора, гранита, оникса и других видов камня для ваших'
                           ' изделий. Имеем собственное производство, более 15 лет на рынке и тысячи заказов по всей '
                           'России. Интерьер, экстерьер, ландшафт. Для дома и бизнеса. Гарантия на изделия. Звоните! '
                           'Работаем: ежедневно 8:00-19:00 вс-выходной'
        })

        return context


class ContactsView(TemplateView):
    template_name = 'main/contacts.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update({
            'title': 'Контакты - Эстетика камня',
            'description': 'Свяжитесь с нами и мы разработаем изделия из натурального камня на ваш вкус и бюджет. '
                           'Столешницы, лестницы, раковины, камины, панно, плитка, фонтаны и многое другое из '
                           'натурального камня. Изготавливаем изделия любой сложности под заказ, собственный цех в г. '
                           'Астрахань. Доставка по всей России. Широкий ассортимент мрамора, гранита, оникса и других '
                           'видов камня для ваших изделий. Имеем собственное производство, более 15 лет на рынке и '
                           'тысячи заказов по всей России. Интерьер, экстерьер, ландшафт. Для дома и бизнеса. Гарантия '
                           'на изделия. Звоните! Работаем: ежедневно 8:00-19:00 вс-выходной'
        })

        return context


def page_not_found_view(request, exception):
    return render(request, '404.html', status=404)
