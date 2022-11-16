from django.urls import path

from .views import SignUpView, SignUpExtendedView, SignInView, SignInConfirmView, SignInConfirmResend, UserInfo, SignOut, PasswordRecovery, PasswordRecoveryConfirm, PasswordRecoveryResend

from .decorators import check_recaptcha

urlpatterns = [
    
    # -- sign up

    path('signup/', check_recaptcha(SignUpView.as_view()), name='signup'),

    path('signup/extended/', check_recaptcha(SignUpExtendedView.as_view()), name='signup_extended'),


    # -- sign out

    path('signout/', SignOut.as_view(), name='signout'),


    # -- password recovery

    path('password_recovery/', PasswordRecovery.as_view(), name='password_recovery'),

    path('password_recovery/confirm/', PasswordRecoveryConfirm.as_view(), name='password_recovery_confirm'),

    path('password_recovery/resend/', PasswordRecoveryResend.as_view(), name='password_recovery_resend'),


    # -- sign in

    path('signin/', check_recaptcha(SignInView.as_view()), name='signin'),

    path('signin/confirm/', SignInConfirmView.as_view(), name='signin_confirm'),

    path('signin/confirm/resend/', SignInConfirmResend.as_view(), name='signin_confirm_resend'),


    # -- user info

    path('info/', UserInfo.as_view(), name='user_info'),
    
    
    # -- change password

    path('password_change/', UserInfo.as_view(), name='password_change'),

]
