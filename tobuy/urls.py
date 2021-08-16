from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='tobuy'),
    path('new/', views.add_mustbuy, name='tobuy_add'),
    path('<int:id>/edit/', views.edit_mustbuy, name='tobuy_edit'),
    path('<int:id>/change_status/', views.change_status_mustbuy, name='tobuy_change_status'),
    path('<int:id>/delete/', views.delete_mustbuy, name='tobuy_del'),
]