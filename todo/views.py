from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.contrib.auth.decorators import login_required

from .models import Task

User = get_user_model()

@login_required()
def index(request):
    tasks = Task.get_today_tasks(request.user)

    return render(request, 'todo/index.html', {
        'tasks': tasks
    })

@login_required()
def create_task(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        status =  True if request.POST.get('status') == 'true' else False

        new_task = Task()
        new_task.name = name
        new_task.status = status
        new_task.author = request.user

        try:
            new_task.save()
            return JsonResponse({
                    'status':'success',
                    'new_task': model_to_dict(new_task)
                })
        except Exception as e:
            return JsonResponse({'status':e})

@login_required()
def edit_task(request, id):
    if request.method == 'POST':
        name = request.POST.get('name')
        status =  True if request.POST.get('status') == 'true' else False

        task = get_object_or_404(Task, id=id)
        task.name = name
        task.status = status

        try:
            task.save()
            return JsonResponse({
                    'status':'success',
                    'task': model_to_dict(task)
                })
        except Exception as e:
            return JsonResponse({'status':e})

@login_required()
def delete_task(request, id):
    task = get_object_or_404(Task, id=id)
    try:
        task.delete()
        return JsonResponse({
                    'status':'success',
                })
    except Exception as e:
            return JsonResponse({'status':e})

@login_required()
def change_status_task(request, id):
    task = get_object_or_404(Task, id=id)
    task.status = not task.status
    try:
        task.save()
        return JsonResponse({
                'status':'success',
                'task': model_to_dict(task)
            })
    except Exception as e:
        return JsonResponse({'status':e})