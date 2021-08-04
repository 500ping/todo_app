from django.shortcuts import render
from django.views.generic import ListView
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.forms.models import model_to_dict

from .models import Task


User = get_user_model()


class TaskListView(ListView):
    queryset = Task.objects.all().order_by('create_date')
    template_name = 'todo/index.html'
    context_object_name = 'tasks'


def create_task(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        status =  True if request.POST.get('status') == 'true' else False
        author = User.objects.filter(username='500ping')[0]

        new_task = Task()
        new_task.name = name
        new_task.status = status
        new_task.author = author

        try:
            new_task.save()
            return JsonResponse({
                    'status':'success',
                    'new_task': model_to_dict(new_task)
                })
        except Exception as e:
            return JsonResponse({'status':e})