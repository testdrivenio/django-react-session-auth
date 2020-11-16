from django.urls import path
from . import views

urlpatterns = [
    path('whoami/', views.check_session),
    path('login/', views.login_view),
    path('logout/', views.logout_view, name='api-logout'),
]
