from django.core import mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from core.settings import DEFAULT_FROM_EMAIL
from django.http import HttpResponse

from users.models import CustomUser

import json

def send_email(values):
    subject = values['subject']
    html_message = render_to_string(values['template'], values['context'])
    plain_message = strip_tags(html_message)
    from_email = DEFAULT_FROM_EMAIL
    to = values['email']
    mail.send_mail(subject, plain_message, from_email, to, html_message=html_message)

def send_mail_to_manager(request):
    
    requestData = json.loads(request.body)
    user = request.user
    manager = CustomUser.objects.get(id = user.manager_id)
    send_email({
        'subject': 'A message from a client assigned to you',
        'email': [manager.email],
        'template': '_mail_user_message.html',
        'context': {
            'subject': requestData['subject'],
            'message': requestData['message'],
            'email': user.email,
            'tel': user.tel,
            'lname': user.last_name,
            'fname': user.first_name
        }
    })


    responce = {
        'alert': 'info',
        'message': 'Your message was sended to your manager'
    }

    return HttpResponse(content=json.dumps(responce), content_type="application/json")