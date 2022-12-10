from django.core import mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from core.settings import DEFAULT_FROM_EMAIL

def send_email(values):
    subject = values['subject']
    html_message = render_to_string(values['template'], values['context'])
    plain_message = strip_tags(html_message)
    from_email = DEFAULT_FROM_EMAIL
    to = values['email']

    mail.send_mail(subject, plain_message, from_email, to, html_message=html_message)
