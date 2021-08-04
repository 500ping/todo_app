from django.shortcuts import render
from django.views.generic import ListView

from .models import Task


class TaskListView(ListView):
    queryset = Task.objects.all().order_by('create_date')
    template_name = 'todo/index.html'
    context_object_name = 'tasks'