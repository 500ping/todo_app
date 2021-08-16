from django.shortcuts import render, get_object_or_404, redirect, reverse
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required

from .models import MustBuy
from .forms import MustbuyForm

User = get_user_model()

@login_required()
def index(request):
    qs = MustBuy.objects.filter(user=request.user).order_by('-create_date')
    return render(request, 'tobuy/tobuy.html', {
        'carts': qs,
    })

@login_required()
def add_mustbuy(request):
    form = MustbuyForm(
        request.POST or None,
        request.FILES or None,
    )

    if request.method == "POST":
        if form.is_valid():
            form.instance.user = request.user
            form.save()
            return redirect(reverse("tobuy"))

    return render(request, 'tobuy/mustbuy_form.html', {
        'form': form,
    })

@login_required()
def edit_mustbuy(request, id):
    mustbuy = get_object_or_404(MustBuy, id=id)
    form = MustbuyForm(
        request.POST or None,
        request.FILES or None,
        instance=mustbuy
    )

    if request.method == "POST":
        if form.is_valid():
            form.save()
            return redirect(reverse("tobuy"))

    return render(request, 'tobuy/mustbuy_form.html', {
        'form': form,
    })

@login_required()
def change_status_mustbuy(request, id):
    if request.method == "POST":
        mustbuy = get_object_or_404(MustBuy, id=id)
        mustbuy.status = not mustbuy.status
        mustbuy.save()

        return redirect(reverse("tobuy"))

@login_required()
def delete_mustbuy(request, id):
    if request.method == "POST":
        mustbuy = get_object_or_404(MustBuy, id=id)
        mustbuy.delete()

        return redirect(reverse("tobuy"))