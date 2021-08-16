from django import forms

from .models import MustBuy

class DateInput(forms.DateInput):
    input_type = 'date'


class MustbuyForm(forms.ModelForm):

    class Meta:
        model = MustBuy
        fields = (
            'name',
            'price',
            'expect_date',
            'status',
        )
        widgets = {
            'expect_date': DateInput(),
        }