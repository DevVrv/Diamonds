from django.views.generic import FormView
from django.contrib.auth.views import PasswordChangeView
from django.contrib.auth import update_session_auth_hash
from django.views.generic.base import TemplateView
from django.urls import reverse_lazy
from django.shortcuts import redirect
from django.contrib.auth.hashers import make_password
from django.contrib.auth import login, logout
from django.contrib import messages


# -- models
from .models import CustomUser, CompanyDetails, ShippingAddress

# -- forms
from .forms import UsersCreationForm, ExtendedUsersCreationForm, UsersAuthForm, UsersConfirmForm, PasswordRecoveryForm, CompanyDetailsForm,  ShippingFormSet, CustomUserChangeForm, ChangePasswordForm

# -- tools
from .code import create_code
from .inspector import Inspector
from mail.views import send_email

# SIGN UP

# -- sign up view
class SignUpView(FormView):
    
    # -- class params
    success_url = reverse_lazy('signup')
    template_name = 'signup.html'
    form_class = UsersCreationForm
    extra_context = {
        'title': 'Registration'
    }
    
    # --> POST
    def post(self, request, *args: str, **kwargs):

        # <-- get form and form data
        form = self.form_class(self.request.POST)
        if self.request.recaptcha_is_valid:
            if form.is_valid():
                
                # <-- get user name from email
                new_user = {
                    'username': form.cleaned_data.get('email').rsplit('@', 2)[0],
                    'email': form.cleaned_data.get('email'),
                    'tel': form.cleaned_data.get('tel'),
                    'password': make_password(form.cleaned_data.get('password1')),
                } 

                # action create new user
                user = CustomUser.objects.create(**new_user)
                user.save()
                
                # success
                messages.success(self.request, 'Registration was successfule')
                return redirect(self.success_url)
            
            return super().post(request, *args, **kwargs)

    # <-- GET
    def get(self, request, *args: str, **kwargs):
        return super().get(request, *args, **kwargs)
        
# -- sign up extended view
class SignUpExtendedView(SignUpView):
    form_class = ExtendedUsersCreationForm
    template_name = 'signup_extended.html'
    success_url = reverse_lazy('signup_extended')

    def get(self, request, *args: str, **kwargs):
        return super().get(request, *args, **kwargs)


# SIGN OUT

# -- sign out
class SignOut(TemplateView):
    def get(self, request, *args, **kwargs):
        logout(request)
        return redirect(reverse_lazy('signin'))


# SIGN IN

# -- sign in
class SignInView(FormView):

    success_url = reverse_lazy('signin_confirm')
    template_name = 'signin.html'
    form_class = UsersAuthForm
    extra_context = {
        'title': 'Sign In'
    }

    # --> POST
    def post(self, request, *args, **kwargs):
        form = self.form_class(self.request.POST)

        # -- recaptcha true
        if self.request.recaptcha_is_valid:
            
            # -- form valid
            if form.is_valid():
                user_type = form.cleaned_data.get('user_type')
                
                # --> client door
                if user_type == '1':
                    
                    # -- generate code
                    code = create_code(request, form.cleaned_data.get('username'), form.cleaned_data.get('remember_me'))
                    
                    # --> send email
                    send_email({
                        'subject': 'Labrilliante email confirm',
                        'email': self.request.session['email'],
                        'template': '_mail_confirm.html',
                        'context': {
                            'code': code,
                            'login': self.request.session['email']
                        }
                    })

                # --> vendor door
                elif user_type == '2':
                    user = CustomUser.objects.filter(email=form.cleaned_data.get('username')).filter(user_type='2')
                    if user.exists():
                        login(self.request, user)
                    else:
                        messages.error(self.request, 'Vendor with this data was not found')
                        return redirect(reverse_lazy('signin'))


            # -- form invalid
            else:
                try:
                    messages.error(self.request, form.errors.as_data()['__all__'][0].message)
                except:
                    messages.error(self.request, 'Something was wrong')
        
        # -- recaptcha false
        else:
            return redirect(reverse_lazy('signin'))

        return super().post(request, *args, **kwargs)

    # <-- GET
    def get(self, request, *args: str, **kwargs):
        return super().get(request, *args, **kwargs)

# -- auth confirm
class SignInConfirmView(FormView):

    template_name = 'signin_confirm.html'
    form_class = UsersConfirmForm
    extra_context = {
        'title': 'Email confirmation',
    }
    success_url = reverse_lazy('user_info')

    # --> POST
    def post(self, request, *args, **kwargs):

        form = self.form_class(request.POST)

        if form.is_valid():
            form_code = form.cleaned_data.get('code')
            mail_code = self.request.session['code']
            email = self.request.session['email']

            if int(form_code) == int(mail_code):
                user = CustomUser.objects.get(email=email)
                login(self.request, user=user)

        return super().post(request, *args, **kwargs)

    # <-- GET
    def get(self, request, *args: str, **kwargs):
        print(self.request.session['email'])
        self.extra_context['email'] = self.request.session['email']
        return super().get(request, *args, **kwargs)

# -- auth confirm replay
class SignInConfirmResend(SignInConfirmView):

    # <-- GET
    def get(self, request, *args: str, **kwargs):
        
        mail = self.request.session['email']
        remember = self.request.session['remember']

        # -- generate code
        code = create_code(request, mail, remember)
        
        # -- set timer
        self.extra_context['timer'] = True
        
        # --> send email
        send_email({
            'subject': 'Labrilliante email confirm',
            'email': self.request.session['email'],
            'template': '_mail_confirm.html',
            'context': {
                'code': code,
                'login': self.request.session['email']
            }
        })

        messages.info(self.request, 'New code was sended on your email')
        return redirect(reverse_lazy('signin_confirm'))


# PASSWORD RECOVERY

# -- restor password
class PasswordRecovery(FormView):

    form_class = PasswordRecoveryForm
    template_name = 'password_recovery.html'
    success_url = 'password_recovery_confirm'
    extra_context = {
        'title': 'Password Recovery',
        'resend_url': 'password_recovery_resend'
    }

    # --> POST
    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)

        if form.is_valid():
            
            code = create_code(request, form.cleaned_data.get('mail'))
            self.request.session['new_pass'] = form.cleaned_data.get('password1')
            

            # --> send email
            send_email({
                'subject': 'Password recovery',
                'email': self.request.session['email'],
                'template': '_mail_confirm.html',
                'context': {
                    'code': code,
                    'title': 'Recovery',
                    'login': self.request.session['email']
                }
            })


            return redirect(reverse_lazy(self.success_url))

        return super().post(request, *args, **kwargs)

    # <-- get
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

# -- auth confirm
class PasswordRecoveryConfirm(FormView):

    template_name = 'password_recovery_confirm.html'
    form_class = UsersConfirmForm
    extra_context = {
        'title': 'Password recovery confirm',
    }
    success_url = 'signin'

    # --> POST
    def post(self, request, *args, **kwargs):
        password = self.request.session['new_pass']
        form = self.form_class(request.POST)

        if form.is_valid():
            
            if int(self.request.session['code']) == int(form.cleaned_data.get('code')):
                user = CustomUser.objects.get(email = self.request.session['email'])
                user.password = make_password(password)
                user.save()
                messages.success(self.request, 'Your password has been successfully updated')
                return redirect(reverse_lazy(self.success_url))

        return super().post(request, *args, **kwargs)

    # <-- GET
    def get(self, request, *args: str, **kwargs):
        return super().get(request, *args, **kwargs)

# -- auth confirm replay
class PasswordRecoveryResend(PasswordRecoveryConfirm):
    
    # <-- GET
    def get(self, request, *args: str, **kwargs):
        
        mail = self.request.session['email']

        # -- generate code
        code = create_code(request, mail)
        
        # -- set timer
        self.extra_context['timer'] = True
        
        # --> send email
        send_email({
            'subject': 'Password recovery',
            'email': self.request.session['email'],
            'template': '_mail_confirm.html',
            'context': {
                'code': code,
                'title': 'Recovery',
                'login': self.request.session['email']
            }
        })

        messages.info(self.request, 'New code was sended on your email')
        return redirect(reverse_lazy('password_recovery_confirm'))


# USER INFO

# -- user info
class UserInfo(TemplateView):
    template_name = 'user_info.html'
    user_form = CustomUserChangeForm
    company_form = CompanyDetailsForm
    shipping_forms = ShippingFormSet
    success_url = 'user_info'

    # -- update shipping
    def update_shipping(self):

        shipping = ShippingAddress.objects.filter(user_id=self.request.user.pk)
        self.shipping_forms.queryset = shipping

        if self.shipping_forms.has_changed():

            new_addresses = []

            # -- create address data
            for item in self.shipping_forms.cleaned_data:
                if item:
                    item['user_id'] = self.request.user.pk
                    del item['id']

                    new_addresses.append(item)


            # -- update or create address data
            for index, item in enumerate(new_addresses):
                if index < len(shipping):
                    shipping[index].shipping_company_name = item['shipping_company_name']
                    shipping[index].shipping_attention_name = item['shipping_attention_name']
                    shipping[index].shipping_address = item['shipping_address']
                    shipping[index].shipping_city = item['shipping_city']
                    shipping[index].shipping_country = item['shipping_country']
                    shipping[index].shipping_region = item['shipping_region']
                    shipping[index].shipping_zip = item['shipping_zip']
                    shipping[index].shipping_tel = item['shipping_tel']
                    shipping[index].shipping_email = item['shipping_email']
                    shipping[index].user_id = shipping[index].user_id
                    shipping[index].save()
                else:
                    item['user_id'] = self.request.user.pk
                    ShippingAddress.objects.create(**item)
                
            return True
        else:
            return False

    # -- get company form
    def get_company(self):

        # if compnay is not registered - create company details
        if not CompanyDetails.objects.filter(user_id=self.request.user.id).exists():
            # create company details
            compnay_details = {
                'user_id': self.request.user.id
            }

            CompanyDetails.objects.create(**compnay_details)
            # create company details form
            form = CompanyDetailsForm()

        # if compnay is registered - get instance from company details
        else:
            # create company details form with instance
            form = CompanyDetailsForm(instance=CompanyDetails.objects.get(user_id=self.request.user.id))

        # return form obj
        return form

    # --> POST
    def post(self, request, *args, **kwargs):

        # -- personal details
        self.user_form = self.user_form(request.POST, instance=CustomUser.objects.get(pk=request.user.pk))
        if self.user_form.is_valid():
            self.user_form.save()
        else:
            messages.error(request, 'A user with this data already exists')
            return redirect(reverse_lazy('user_info'))

        # -- company details
        self.company_form = self.company_form(request.POST, instance=CompanyDetails.objects.get(user_id=request.user.pk))
        if self.company_form.is_valid():
            self.company_form.save()
        
        # -- shipping details
        self.shipping_forms = self.shipping_forms(request.POST)
        if self.shipping_forms.is_valid():
            shipping_changed = self.update_shipping()
        
        # changes detection 
        if not self.user_form.has_changed() and not self.company_form.has_changed() and not self.shipping_forms.has_changed():
            messages.info(self.request, 'You haven\'t made any changes')
        else:
            messages.success(request, 'You have successfully updated your profile information')
            company = CompanyDetails.objects.get(user_id=request.user.pk)
            manager = CustomUser.objects.get(pk=request.user.manager_id)
            send_email({
                'subject': f'User {request.user.email} was updated',
                'email': manager.email,
                'template': '_mail_user_updated.html',
                'context': {
                    'fname': request.user.first_name,
                    'user_email': request.user.email,
                    'user_tel': request.user.tel,
                    'company_name': company.company_name,
                    'company_tel': company.company_tel,
                    'company_email': company.company_email,
                    'company_address': company.company_address,
                }
            })

        return redirect(reverse_lazy(self.success_url))

    # <-- GET
    def get(self, request, *args: str, **kwargs):

        # -- user form
        self.user_form = self.user_form(instance=request.user or None)

        # -- company form
        self.company_form = self.get_company()
        
        # -- shipping formset
        self.shipping_forms = self.shipping_forms()

        # -- extra context
        self.extra_context = {
            'title': 'User Info',
            'user_form': self.user_form,
            'company_form': self.company_form,
            'shipping_formset': self.shipping_forms
        }
        
        return super().get(request, *args, **kwargs)

# CHAGE PASSWORD

# -- user info change pass
class ChangePassword(PasswordChangeView):

    template_name = 'change_pass.html'
    extra_context = {
        'title': 'Change Password'
    }
    success_url = reverse_lazy('user_info')
    form_class = ChangePasswordForm

    # --> POST
    def post(self, request, *args, **kwargs):

        form = self.form_class(request.user, request.POST)

        if form.is_valid():
            messages.success(request, 'Your password was successfully changed')
        else:
            messages.error(request, form.errors.as_text())

        return super().post(request, *args, **kwargs)


    # <-- GET
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)