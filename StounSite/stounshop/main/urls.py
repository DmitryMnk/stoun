from django.urls import path
from .views import *


urlpatterns = [
    path('', MainView.as_view(), name='main'),
    path('наши_работы/', PortfolioView.as_view(), name='portfolio'),
    path('контакты/', ContactsView.as_view(), name='contacts'),
    path('о_нас/', AboutView.as_view(), name='about'),
]