from django.views.generic.base import TemplateView

class Access_denied(TemplateView):
    template_name = '403.html'

