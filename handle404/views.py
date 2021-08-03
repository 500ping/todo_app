from django.shortcuts import render

def error(request, exception):
    return render(request, '404.html', {'message': exception})