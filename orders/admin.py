
from django.contrib import admin

# Register your models here.

from .models import Orders_model, Orders_Diamond_Model

# @ ORDER STATUS ACTIONS

@admin.action(description='Rejected Orders')
def status_rejected(modeladmin, request, queryset):
    for item in queryset:
        item.order_status = 0
        item.save()

@admin.action(description='Verefication Orders')
def status_verification(modeladmin, request, queryset):
    for item in queryset:
        item.order_status = 1
        item.save()

@admin.action(description='Acepted Orders')
def status_acepted(modeladmin, request, queryset):
    for item in queryset:
        item.order_status = 2
        item.save()

@admin.action(description='Delivery is in progress')
def status_delivery(modeladmin, request, queryset):
    for item in queryset:
        item.order_status = 3
        item.save()

@admin.action(description='Orders Delivered')
def status_delivered(modeladmin, request, queryset):
    for item in queryset:
        item.order_status = 4
        item.save()

@admin.action(description='Orders Completed')
def status_completed(modeladmin, request, queryset):
    for item in queryset:
        item.order_status = 5
        item.save()

# @ ORDER TYPE ACTION

@admin.action(description='COD')
def type_cod(modeladmin, request, queryset):
    for item in queryset:
        item.order_type = 0
        item.save()

@admin.action(description='Invoice')
def type_invoice(modeladmin, request, queryset):
    for item in queryset:
        item.order_type = 1
        item.save()

@admin.action(description='Cash Memo')
def type_cash_memo(modeladmin, request, queryset):
    for item in queryset:
        item.order_type = 2
        item.save()

@admin.action(description='Memo')
def type_memo(modeladmin, request, queryset):
    for item in queryset:
        item.order_type = 3
        item.save()

@admin.action(description='Hold')
def type_hold(modeladmin, request, queryset):
    for item in queryset:
        item.order_type = 4
        item.save()


@admin.register(Orders_model)
class Orders_Model_admin(admin.ModelAdmin):

    list_display = (
        'id',
        'user_id', 
        'order_status',
        'order_number', 
        'order_type', 
        'total_diamonds', 
        'total_carat', 
        'total_price', 
        'total_price', 
        'created_at',
        'pay_within', 
        'p_ct_offer', 
        'total_price_offer', 
        'hold_hours',
    )
    list_editable = ('order_type', 'order_status')
    list_display_links = ('id', 'order_number')
    list_filter = ['order_status', 'order_type']
    search_fields = ('user__username', 'order_number')
    readonly_fields = ('diamonds_list', 'total_carat', 'total_diamonds')
    actions = [status_rejected, status_verification, status_acepted, status_delivery, status_delivered, type_cod, type_invoice, type_cash_memo, type_memo, type_hold] 

@admin.register(Orders_Diamond_Model)
class Orders_Diamonds_Admin(admin.ModelAdmin):
    list_display = (
        'id', 
        'order_number',
        'order_id',
        'buyer_id',
        'shape',
        'certificate', 
        'weight', 
        'color', 
        'clarity', 
        'total_price', 
        'price_per_ct', 
        'sale_price', 
        'rap_disc', 
        'rap_price', 
        'created_at', 
        'updated_at',
    )
    list_display_links = ('id', 'shape')
    list_filter = ['shape', 'color', 'clarity']
    search_fields = ('order_number', 'order_id', 'buyer_id')
    save_on_top = True