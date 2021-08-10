from django.shortcuts import render, get_object_or_404, redirect, reverse
from django.contrib.auth.models import User

from .forms import ProfileForm
from .models import UserProfile

def user_profile(request):
    user = get_object_or_404(UserProfile, user=request.user)
    form = ProfileForm(
        request.POST or None,
        request.FILES or None,
        instance=user
    )

    if request.method == "POST":
        if form.is_valid():
            form.instance.user = request.user
            form.save()
            return redirect(reverse("user_profile"))

    return render(request, 'account/user_profile.html', {
        'form': form,
    })