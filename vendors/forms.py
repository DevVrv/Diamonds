from django import forms
from users.forms import UsersCreationForm

# * upload white list
class UploadCSV(forms.Form):
    diamonds = forms.FileField(
        label='', 
        widget=forms.FileInput(attrs={'class': 'form-control input-file',}),
    )

# * vendor create
class VendorCreationForm(UsersCreationForm):

    user_types = (
        (2, '2 - Vendor'),
    )

    user_type = forms.ChoiceField(initial=2, choices=user_types, widget=forms.RadioSelect(attrs={
        'class': 'd-none'
    }))

    email = forms.EmailField(required=False, max_length=255, label='', widget=forms.EmailInput(attrs={
        'class': 'form-control',
        'placeholder': 'Email',
        }))

    tel = forms.IntegerField(required=False, label='', widget=forms.TextInput(attrs={
        'class': 'form-control',
        'placeholder': 'Tel',
        }))