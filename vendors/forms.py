from django import forms
from django.core.exceptions import ValidationError

# * upload white list
class UploadCSVForm(forms.Form):
    csv = forms.FileField(
        label='', 
        widget=forms.FileInput(attrs={'class': 'form-control input-file',}),
    ) 
    
    def clean(self):
        file = self.cleaned_data.get("csv", False)
        if not file.name.endswith('.csv'):
            raise ValidationError("The uploaded file must be in the format: CSV")
