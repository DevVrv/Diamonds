from django.contrib import admin

from .models import CustomUser, CompanyDetails, ShippingAddress

# -- User details
@admin.register(CustomUser)
class CustomUsersAdmin(admin.ModelAdmin):
    list_display = (
      'id', 
      'user_type',
      'username', 
      'level', 
      'manager', 
      'first_name', 
      'last_name', 
      'job_title', 
      'email', 
      'tel',
    )
    list_display_links = ('id', 'username')
    list_editable = ('level', 'manager')
    save_on_top = True
    readonly_fields = ('password',)
    
    
# -- Company details 
@admin.register(CompanyDetails)
class CompanyDetailsAdmin(admin.ModelAdmin):
    list_display = (
      'id', 
      'company_name', 
      'company_tel', 
      'company_email', 
      'company_web_address', 
      'company_address', 
      'company_city', 
      'company_region', 
      'company_country', 
      'company_zip',
      'user_id', 
    )
    list_display_links = ('id', 'company_name')
    search_fields = ('company_name', 'user__username',)

# -- Shipping address
@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = (
      'id', 
      'shipping_company_name', 
      'shipping_tel', 
      'shipping_email', 
      'shipping_attention_name', 
      'shipping_address', 
      'shipping_city', 
      'shipping_region', 
      'shipping_country', 
      'shipping_zip', 
      'user_id'
    )
    list_display_links = ('id', 'shipping_company_name')
    search_fields = ('shipping_company_name', 'user__username',)
