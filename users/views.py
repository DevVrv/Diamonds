from django.shortcuts import render
from django.views.generic import FormView
from django.views.generic.base import TemplateView
from django.urls import reverse_lazy
from django.shortcuts import redirect
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages


# -- models
from .models import CustomUser

# -- forms
from .forms import UsersCreationForm, ExtendedUsersCreationForm, UsersAuthForm, UsersConfirmForm

# -- tools
from .code import create_code
from .inspector import Inspector
from mail.views import send_email


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
        inspect = Inspector(request, {})
        if inspect.inspect_auth():
            return redirect(reverse_lazy('user_info'))
        else:
            return super().get(request, *args, **kwargs)

# -- auth confirm
class SignInConfirmView(FormView):

    template_name = 'confirm.html'
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

            if form_code == mail_code:
                user = CustomUser.objects.get(email=email)
                print(authenticate(user))

        return super().post(request, *args, **kwargs)

    # <-- GET
    def get(self, request, *args: str, **kwargs):
        self.extra_context['email'] = self.request.session['email']
        print(self.extra_context)
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

# -- sign out
class SignOut(TemplateView):
    pass

# -- user info
class UserInfo(TemplateView):

    template_name = 'user_info.html'
    extra_context = {
        'title': 'User Info'
    }

    # <-- GET
    def get(self, request, *args: str, **kwargs):
        return super().get(request, *args, **kwargs)
