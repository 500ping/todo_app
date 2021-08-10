from django import forms
from crispy_forms.helper import FormHelper

from .models import UserProfile


class ProfileForm(forms.ModelForm):

    class Meta:
        model = UserProfile
        fields = (
            'first_name',
            'last_name',
            'gender',
            'avatar',
            'about',
        )