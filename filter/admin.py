
from django.contrib import admin
from .models import Diamond_Model, Fancy_Diamond_Model, MaxMin

@admin.action(description='To publish')
def set_published(modeladmin, request, queryset):
    queryset.update(is_published=1)

@admin.action(description='Mark as Best selling')
def set_best(modeladmin, request, queryset):
    queryset.update(best_selling=1)

@admin.action(description='Remove from publication')
def unset_published(modeladmin, request, queryset):
    queryset.update(is_published=0)

@admin.action(description='Remove mark as Best selling')
def unset_best(modeladmin, request, queryset):
    queryset.update(best_selling=0)

@admin.register(Diamond_Model)
class Diamond_Model_admin(admin.ModelAdmin):
    list_display = (
        'id', 
        'shape',
        'certificate', 
        'best_selling', 
        'weight', 
        'color', 
        'clarity', 
        'rap_1ct', 
        'sale_price', 
        'created_at', 
        'updated_at',
    )
    list_display_links = ('id', 'shape')
    list_editable = ['best_selling']
    list_filter = ['shape', 'color', 'clarity', 'is_published', 'best_selling']
    search_fields = ('id', 'rap_1ct', 'rap_price', 'sale_price',)
    save_on_top = True
    actions = [set_best, set_published, unset_best, unset_published]


@admin.register(Fancy_Diamond_Model)
class Fancy_Diamond_Model_admin(admin.ModelAdmin):
    list_display = (
        'id', 
        'shape',
        'certificate', 
        'best_selling', 
        'weight', 
        'color', 
        'clarity', 
        'rap_1ct', 
        'sale_price', 
        'created_at', 
        'updated_at',
    )
    list_display_links = ('id', 'shape')
    list_editable = ['best_selling']
    list_filter = ['shape', 'color', 'clarity', 'is_published', 'best_selling']
    search_fields = ('id', 'rap_1ct', 'rap_price', 'sale_price',)
    save_on_top = True
    actions = [set_best, set_published, unset_best, unset_published]

@admin.register(MaxMin)
class Max_Min_Admin(admin.ModelAdmin):
    list_display = (
        'id', 
        'name',
        'min',
        'max',
    )
    list_display_links = ('id', 'name')
    list_editable = ['min', 'max']

