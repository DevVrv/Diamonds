from django import forms
from django.contrib.auth.forms import AuthenticationForm
from .models import CustomUser
from django.contrib import messages

from django.core.exceptions import ValidationError

# -- signup form
class UsersCreationForm(forms.Form):

    # form inputs
    user_type = forms.CharField(initial=1, required=False, max_length=1, widget=forms.RadioSelect(attrs={
        'class': 'd-none'
    }))
    email = forms.CharField(required=True, max_length=255, label='', widget=forms.EmailInput(attrs={
        'class': 'form-control',
        'placeholder': 'Email',
        
        }))
    tel = forms.IntegerField(required=True, label='', widget=forms.TextInput(attrs={
        'class': 'form-control',
        'placeholder': 'Tel',

        }))
    password1 = forms.CharField(max_length=150, label='', widget=forms.PasswordInput(attrs={
        'class': 'form-control',
        'placeholder': 'Password'
        }))
    password2 = forms.CharField(max_length=150, label='', widget=forms.PasswordInput(attrs={
        'class': 'form-control',
        'placeholder': 'Repeat the password'
        }))

    # email validation
    def clean_email(self):
        email = self.cleaned_data['email']
        if CustomUser.objects.filter(email=email).exists():
            raise ValidationError("Email already exists")
        return self.cleaned_data

        # email validation
    def clean_tel(self):
        tel = self.cleaned_data['tel']
        if CustomUser.objects.filter(tel=tel).exists():
            raise ValidationError("Tel already exists")
        return self.cleaned_data

    # password validation
    def clean(self):
        form_data = self.cleaned_data
        if form_data['password1'] != form_data['password2']:
            self._errors["password1"] = "Password do not match" # Will raise a error message
            del form_data['password1']
        return self.cleaned_data

    # meta settings
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'tel')

# -- signup form exntended
class ExtendedUsersCreationForm(UsersCreationForm):
    user_types = (
        (0, 'Type - Staff'),
        (1, 'Type - User'),
        (2, 'Type - Vendor'),
    )
    user_type = forms.ChoiceField(initial=1, choices=user_types, widget=forms.Select(attrs={
        'class': 'form-select'
    }))

# -- signin form
class UsersAuthForm(forms.Form):

    user_types = (
        (1, 'Client'),
        (2, 'Vendor'),
    )
    username = forms.CharField(max_length=250, label='', widget=forms.TextInput(attrs={
        'class': 'form-control',
        'placeholder': 'Email'
        }))
    password = forms.CharField(max_length=250, label='', widget=forms.PasswordInput(attrs={
        'class': 'form-control',
        'placeholder': 'Password'
        }))
    user_type = forms.ChoiceField(choices=user_types, widget=forms.RadioSelect(attrs={'class': 'd-none switcher'}), initial='1')
    remember_me = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={
        'class': 'checkbox d-none',
        }))

    # email validation
    def clean(self):
        
        # <-- GET form clean data
        email = self.cleaned_data['username']
        password = self.cleaned_data['password']
        
        # -- check email
        if CustomUser.objects.filter(email=email).exists():
            user = CustomUser.objects.get(email=email)
            
            # -- check password
            if user.check_password(password) != True:
                raise ValidationError('Incorrect username or password')
        else:
            raise ValidationError('User with this email was not found')

        return self.cleaned_data

    # meta settings
    class Meta:
        model = CustomUser
        fields = ('email')

# -- singin confirm form
class UsersConfirmForm(forms.Form):
    code = forms.CharField(max_length=6, min_length=6, label='', 
    widget=forms.NumberInput(attrs={
        'class': 'form-control text-center px-0',
        'placeholder': 'Enter Code'
    }))


