from django.urls import path
from . import views

urlpatterns = [
    path('', views.TaskListView.as_view(), name='index'),
    path('task/', views.create_task, name='create_task'),
]