from django.urls import path
from . import views

urlpatterns = [
    path('', views.TaskListView.as_view(), name='index'),
    path('task/', views.create_task, name='create_task'),
    path('task/<int:id>/', views.edit_task, name='edit_task'),
    path('task/<int:id>/delete/', views.delete_task, name='delete_task'),
]