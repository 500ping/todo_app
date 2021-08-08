from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('task/', views.create_task, name='create_task'),
    path('task/<int:id>/', views.edit_task, name='edit_task'),
    path('task/<int:id>/delete/', views.delete_task, name='delete_task'),
    path('task/<int:id>/change_status/', views.change_status_task, name='change_status_task'),
]