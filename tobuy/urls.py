from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='tobuy'),
    path('new/', views.add_mustbuy, name='tobuy_add'),
    path('<int:id>/edit/', views.edit_mustbuy, name='tobuy_edit'),
    path('<int:id>/done/', views.set_done_mustbuy, name='tobuy_setdone'),
    path('<int:id>/delete/', views.delete_mustbuy, name='tobuy_del'),
]