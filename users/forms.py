from django import forms
from django.forms import modelformset_factory, BaseModelFormSet
from django.contrib.auth.forms import UserChangeForm
from django.core.exceptions import ValidationError

from .models import CustomUser, CompanyDetails, ShippingAddress

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
        return self.cleaned_data['email']

    # tel validation
    def clean_tel(self):
        tel = self.cleaned_data['tel']
        if CustomUser.objects.filter(tel=tel).exists():
            raise ValidationError("Tel already exists")
        return self.cleaned_data['tel']

    # password validation
    def clean(self):
        form_data = self.cleaned_data
        if len(form_data['password1']) < 8:
            self._errors["password1"] = "The password must be at least 8 characters long" # Will raise a error message
        if form_data['password1'] != form_data['password2']:
            self._errors["password1"] = "Password do not match" # Will raise a error message
            del form_data['password1']
        return self.cleaned_data

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

# -- password recovery
class PasswordRecoveryForm(forms.Form):
    mail = forms.CharField(required=True, max_length=255, label='', widget=forms.EmailInput(attrs={
        'class': 'form-control',
        'placeholder': 'Email',
        
        }))
    password1 = forms.CharField(max_length=150, label='', widget=forms.PasswordInput(attrs={
        'class': 'form-control',
        'placeholder': 'New Password'
        }))
    password2 = forms.CharField(max_length=150, label='', widget=forms.PasswordInput(attrs={
        'class': 'form-control',
        'placeholder': 'Repeat new password'
        }))

    # email validation
    def clean_email(self):
        email = self.cleaned_data['email']
        if CustomUser.objects.filter(email=email).exists() == False:
            raise ValidationError("Email was not found")
        return self.cleaned_data

    # password validation
    def clean(self):
        form_data = self.cleaned_data
        if len(form_data['password1']) < 8:
            self._errors["password1"] = "The password must be at least 8 characters long" # Will raise a error message
        if form_data['password1'] != form_data['password2']:
            self._errors["password1"] = "Password do not match" # Will raise a error message
            del form_data['password1']
        return self.cleaned_data

# -- change client info form
class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'job_title', 'email', 'tel']
        widgets = {
            'first_name': forms.TextInput(attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),
            'last_name': forms.TextInput(attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),
            'email': forms.EmailInput(attrs={'disabled': 'true', 'class': 'form-control form-control-client-info'}),
            'tel': forms.TextInput(attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),
            'job_title': forms.TextInput(attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),
        }

# -- company details form
class CompanyDetailsForm(forms.ModelForm):
    class Meta:
        model = CompanyDetails
        fields = [
            'company_name', 
            'company_address', 
            'company_city', 
            'company_country', 
            'company_region', 
            'company_zip', 
            'company_tel', 
            'company_email', 
            'company_web_address'
            ]
        widgets = {
            'company_name': forms.TextInput(attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),
            'company_tel': forms.NumberInput(attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),
            'company_email': forms.EmailInput(attrs={'disabled': 'true', 'class': 'form-control form-control-client-info'}),
            'company_address': forms.TextInput(attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),
            'company_city': forms.TextInput(attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),
            'company_web_address': forms.TextInput(attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),
            'company_region': forms.TextInput(attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),
            'company_country': forms.TextInput(attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),
            'company_zip': forms.TextInput(attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),
        }

# TODO FORMSER
class ShippingAddressFormSet(BaseModelFormSet):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.queryset = ShippingAddress.objects.filter(user_id=22)

# -- shipping formset
ShippingFormSet = modelformset_factory(

    model=ShippingAddress, 
    
    fields=(
        'shipping_company_name', 
        'shipping_attention_name',
        'shipping_address', 
        'shipping_city', 
        'shipping_country', 
        'shipping_region', 
        'shipping_zip', 
        'shipping_tel', 
        'shipping_email', 
    ),

    widgets = {
        'shipping_company_name': forms.TextInput(
            attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),
            
        'shipping_attention_name': forms.TextInput(
            attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),

        'shipping_tel': forms.NumberInput(
            attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),

        'shipping_email': forms.EmailInput(
            attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),

        'shipping_address': forms.TextInput(
            attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),

        'shipping_city': forms.TextInput(
            attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),

        'shipping_region': forms.TextInput(
            attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),

        'shipping_country': forms.TextInput(
            attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),

        'shipping_zip': forms.TextInput(
            attrs={'disabled': 'true', 'class': 'form-control form-control-client-info w-100 rounded mt-2'}),
    },

    extra=1,

    formset=ShippingAddressFormSet,

)



