from django.urls import path

from .views import SignUpView, SignUpExtendedView, SignInView, SignInConfirmView, SignInConfirmResend, UserInfo, SignOut

from .decorators import check_recaptcha

urlpatterns = [
    
    path('signup/', check_recaptcha(SignUpView.as_view()), name='signup'),

    path('signup/extended/', check_recaptcha(SignUpExtendedView.as_view()), name='signup_extended'),

    path('signout/', SignOut.as_view(), name='signout'),

    path('signin/', check_recaptcha(SignInView.as_view()), name='signin'),

    path('signin/confirm/', SignInConfirmView.as_view(), name='signin_confirm'),

    path('signin/confirm/resend/', SignInConfirmResend.as_view(), name='signin_confirm_resend'),

    path('info/', UserInfo.as_view(), name='user_info'),

    path('password_change/', UserInfo.as_view(), name='password_change'),

]
