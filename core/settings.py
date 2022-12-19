from pathlib import Path
import os


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-3amu5gm^@!nr1d-!q$j3k%_#44+v*r)1i(fl0u+2p(x%n$@3j+'

GOOGLE_RECAPTCHA_SECRET_KEY = '6LfQ9XggAAAAAJ2DMOIX5-ouv5DDds7JzEDLWZcF'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'debug_toolbar',

    'users.apps.UsersConfig',
    'mail.apps.MailConfig',
    'filter.apps.FilterConfig',
    'vendors.apps.VendorsConfig',
    'share.apps.ShareConfig',
    'cart.apps.CartConfig',
    'orders.apps.OrdersConfig',
    'ftp.apps.FtpConfig'

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

INTERNAL_IPS = [
    # ...
    "localhost",
    'corsheaders.middleware.CorsMiddleware',
    # ...
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, ''),
            os.path.join(BASE_DIR, 'core/templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', 
        'NAME': 'brilliante',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# user
AUTH_USER_MODEL = 'users.CustomUser'
# AUTHENTICATION_BACKENDS = ['users.views.EmailBackend']
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

# отвечает за генирацию url адресов ведущих к статике
STATIC_URL = '/static/'
# создаст путь и папку с статикой
STATIC_ROOT =  os.path.join(BASE_DIR, 'static')
# список путей от куда будет браться статика
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'core/static'),
]


MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'


# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# EMAIL SETTINGS

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'sales@labrilliante.com'
EMAIL_HOST_PASSWORD = 'mlieejztbavlckrm'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'sales@labrilliante.com'

# FTP
FTP_IP = '127.0.0.1'
FTP_PORT = '21'

# Logging
DJANGO_LOG_PATH = 'A:\\code\\Current\\dj\\core\\core\\log\\core.log'
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'WARNING',
            'class': 'logging.FileHandler',
            'filename': DJANGO_LOG_PATH,
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'WARNING',
            'propagate': True,
        },
    },
}