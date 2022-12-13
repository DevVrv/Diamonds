import os
import hashlib

from django.views.generic import FormView
from django.contrib.auth.views import PasswordChangeView
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
from .verification_code import create_code
from .inspector import Inspector
from mail.views import send_email
from core.settings import DEFAULT_FROM_EMAIL

# -- ftp
from ftp.ftp_server import get_ftp_user, add_ftp_user, del_ftp_user

# -- reciver
from django.db.models.signals import pre_save
from django.dispatch import receiver

# SIGN UP

# -- sign up view
class SignUpView(FormView):
    
    # -- class params
    success_url = 'signin'
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
                    'username': form.cleaned_data.get('email'),
                    'email': form.cleaned_data.get('email'),
                    'tel': form.cleaned_data.get('tel'),
                    'password': make_password(form.cleaned_data.get('password1')),
                } 

                # action create new user
                user = CustomUser.objects.create(**new_user)
                user.save()
                
                email = user.email
                tel = user.tel
                messages.success(self.request, 'Success, now you can log in to the site')
                send_email({
                    'subject': f'New user was created',
                    'email': [DEFAULT_FROM_EMAIL],
                    'template': '_mail_user_created.html',
                    'context': {
                        'email': email,
                        'tel': tel
                    }
                })

                return redirect(reverse_lazy(self.success_url))
            
            return super().post(request, *args, **kwargs)
        else:
            return redirect(reverse_lazy('signup'))

    # <-- GET
    def get(self, request, *args, **kwargs):

        # -- permissions
        permission = Inspector(request)
        if permission.auth:
            return redirect(reverse_lazy('user_info'))

        return super().get(request, *args, **kwargs)
        
# -- sign up extended view
class SignUpExtendedView(FormView):
    form_class = ExtendedUsersCreationForm
    template_name = 'signup_extended.html'
    success_url = 'signup_extended'
    extra_context = {
        'title': 'Registration Extended'
    }
    
    # --> POST
    def post(self, request, *args: str, **kwargs):

        # <-- get form and form data
        form = self.form_class(self.request.POST)
        if self.request.recaptcha_is_valid:
            if form.is_valid():
                
                # <-- get user name from email
                new_user = {
                    'username': form.cleaned_data.get('email'),
                    'email': form.cleaned_data.get('email'),
                    'tel': form.cleaned_data.get('tel'),
                    'password': make_password(form.cleaned_data.get('password1')),
                    'user_type': form.cleaned_data.get('user_type')
                } 

                # action create new user
                user = CustomUser.objects.create(**new_user)
                user.save()

                if new_user['user_type'] == '0':
                    user.is_staff = True
                    user.save()
                elif new_user['user_type'] == '2':
                    
                    user_name = new_user['username']
                    user_password = form.cleaned_data.get('password1').encode('utf-8')
                    hash_password = hashlib.md5(user_password).hexdigest()
                    
                    # create ftp user
                    if not get_ftp_user(username=user_name):
                        add_ftp_user(f'{user_name} {hash_password}')
                    else:
                        del_ftp_user(username=user_name)
                        add_ftp_user(f'{user_name} {hash_password}')

                    # create ftp dir for vendor
                    try:
                        os.chdir('ftp/ftp_folders')
                    except FileNotFoundError:
                        pass

                    if not os.path.isdir(user_name):
                        os.mkdir(user_name)
                        messages.info(request, f'Folder: {user_name}, was created')        
                    else:
                        messages.error(request, 'Vendor Folder was not created, folder name already exists')
                    
                user_type_name = {
                    '0': 'staff',
                    '1': 'user',
                    '2': 'vendor',
                }

                # success message
                messages.success(self.request, f'Success, new {user_type_name[user.user_type]} was created')

                return redirect(reverse_lazy(self.success_url))
            
            return super().post(request, *args, **kwargs)
        else:
            return redirect(reverse_lazy('signup_extended'))

    # <-- GET
    def get(self, request, *args, **kwargs):

        # -- permissions
        permission = Inspector(request)
        permission_list = ['users.add_customuser']
        permission.has_permissions(permissions_list=permission_list)
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
                user_name = form.cleaned_data.get('username')
                

                # --> client door
                if user_type == '1' or user_type == '0':

                    # -- generate code
                    code = create_code(request, form.cleaned_data.get('username'), form.cleaned_data.get('remember_me'))
                    
                    # --> send email
                    send_email({
                        'subject': 'Labrilliante email confirm',
                        'email': [self.request.session['email']],
                        'template': '_mail_confirm.html',
                        'context': {
                            'code': code,
                            'login': self.request.session['email']
                        }
                    })

                # --> vendor door
                elif user_type == '2':
                    user = CustomUser.objects.get(username=user_name)
                    login(request, user)
                    messages.success(request, 'You have been successfully logged in')
                    return redirect(reverse_lazy('white'))

                # -- unexpected
                else:
                    messages.error(request, 'Check the entered data')
                    return redirect(reverse_lazy('signin'))
        
        # -- recaptcha false
        else:
            return redirect(reverse_lazy('signin'))

        return super().post(request, *args, **kwargs)

    # <-- GET
    def get(self, request, *args, **kwargs):
        # -- permissions
        permission = Inspector(request)
        if permission.auth:
            return redirect(reverse_lazy('user_info'))
        return super().get(request, *args, **kwargs)

# -- auth confirm
class SignInConfirmView(FormView):

    template_name = 'signin_confirm.html'
    form_class = UsersConfirmForm
    extra_context = {
        'title': 'Email confirmation',
    }
    success_url = 'user_info'

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
                messages.success(request, 'You have been successfully logged in')

                if user.level == 0:
                    user.level = 1
                    user.save()

                return redirect(reverse_lazy(self.success_url))
            else:
                messages.error(request, 'Invalid code')
                return redirect(reverse_lazy('signin_confirm'))

        return super().post(request, *args, **kwargs)

    # <-- GET
    def get(self, request, *args, **kwargs):
        # -- permissions
        permission = Inspector(request)
        if permission.inspect():
            return redirect(reverse_lazy('user_info'))
        return super().get(request, *args, **kwargs)

# -- auth confirm replay
class SignInConfirmResend(SignInConfirmView):

    # <-- GET
    def get(self, request, *args: str, **kwargs):

        # -- permissions
        permission = Inspector(request)
        if permission.inspect():
            return redirect(reverse_lazy('user_info'))

        mail = self.request.session['email']
        remember = self.request.session['remember']

        # -- generate code
        code = create_code(request, mail, remember)
        
        # -- set timer
        self.extra_context['timer'] = True
        
        # --> send email
        send_email({
            'subject': 'Labrilliante email confirm',
            'email': [self.request.session['email']],
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
                'email': [self.request.session['email']],
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

        # -- permissions
        permission = Inspector(request)
        if permission.inspect():
            return redirect(reverse_lazy('signin'))

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
            'email': [self.request.session['email']],
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
            messages.success(request, 'Thank you for registering at LaBrilliante.com. We’ll take just a few minutes to check your information and give you an open access to our website. Browse lab-grown diamonds with LaBrilliante!')
            company = CompanyDetails.objects.get(user_id=request.user.pk)
            manager = CustomUser.objects.get(pk=request.user.manager_id)

            user = request.user

            send_email({
                'subject': f'User {request.user.email} was updated',
                'email': [manager.email, DEFAULT_FROM_EMAIL],
                'template': '_mail_user_updated.html',
                'context': {
                    'fname': user.first_name,
                    'lname': user.last_name,
                    'user_email': user.email,
                    'user_tel': user.tel,
                    'company_name': company.company_name,
                    'company_tel': company.company_tel,
                    'company_email': company.company_email,
                    'company_address': company.company_address,
                }
            })

        return redirect(reverse_lazy(self.success_url))

    # <-- GET
    def get(self, request, *args: str, **kwargs):

        permission = Inspector(request, {'level': 0, 'type': 1})
        if not permission.inspect():
            return redirect(reverse_lazy('signin'))

        # -- user form
        self.user_form = self.user_form(instance=request.user or None)

        # -- company form
        self.company_form = self.get_company()
        
        # -- shipping formset
        shipping = ShippingAddress.objects.filter(user_id = request.user.id)
        if not shipping.exists():
            self.shipping_forms = self.shipping_forms(queryset= ShippingAddress.objects.none())
        else:
            self.shipping_forms = self.shipping_forms(queryset= shipping)



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

        # -- permissions
        permission = Inspector(request)
        if not permission.inspect():
            return redirect(reverse_lazy('signin'))

        return super().get(request, *args, **kwargs)


# * ------------------------------------------------------------------- receiver for update user level and user email
@receiver(pre_save, sender=CustomUser)
def on_change(sender, instance: CustomUser, **kwargs):
    if instance.id is None: # new object will be created
        pass # write your code here
    else:
        try:
            # send email message if level was update
            previous = CustomUser.objects.get(id=instance.id)
            if previous.level != instance.level: # field will be updated
                if previous.level < instance.level and instance.level >= 2:
                    send_email({
                        'subject': 'Raising the level',
                        'email': [instance.email],
                        'template': '_mail_user_raise.html',
                        'context': {
                            'title': 'Your level has been upgraded',
                            'message': 'New features are available to you on the site',
                            'level': instance.level,
                        }
                    })

            # user name update if email was changed
            if previous.email != instance.email:
                instance.username = instance.email
                instance.save()
        except:
            pass
                

            