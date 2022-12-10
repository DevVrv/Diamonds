from django.core import serializers

from django.shortcuts import HttpResponse
from orders.models import Orders_model, Orders_Diamond_Model
from cart.models import CartModal
from filter.models import Diamond_Model
from users.models import CustomUser, CompanyDetails
from django.shortcuts import render, redirect
from django.urls import reverse_lazy

from django.utils import timezone

from users.inspector import Inspector
import json

from mail.views import send_email

# -- reciver
from django.db.models.signals import pre_save
from django.dispatch import receiver

# * Get orders page
def get_orders(request):

    permission = Inspector(request, {'type': 1, 'level': 2})
    if not permission.inspect():
        return redirect(reverse_lazy('user_info'))

    orders_model = Orders_model.objects.filter(user_id = request.user.id)

    try:
        cart = len(json.loads(CartModal.objects.get(user = request.user.pk).user_cart))
    except:
        cart = 0

    context = {
        'orders': orders_model,
        'title': 'Orders',
        'cart_len': cart,

    }

    return render(request, 'orders.html', context)

# * Get order details page
def get_order_details(request):

    # * request data
    requestData = json.loads(request.body)

    # * order items
    order = Orders_model.objects.filter(user_id = request.user.id).get(order_number = requestData['number'])
    
    # * diamonds list
    diamonds = Orders_Diamond_Model.objects.filter(order_number = requestData['number'])
    

    # * user info
    user = CustomUser.objects.get(pk=request.user.pk)
    
    # * create responce object
    responce = {
        'diamonds': serializers.serialize('json', diamonds),
        'carat': round(order.total_carat, 2),
        'len': order.total_diamonds,
        'price': order.total_price,
        'status': order.order_status,
        'type': order.order_type,
        'number': order.order_number,
        'placed': order.created_at.strftime('%b-%d-%m-%Y'),

        'name': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'tel': user.tel,
        
    }
    try:
        company = CompanyDetails.objects.get(user_id = request.user.id)
        responce['address'] = company.company_address,
    except:
        responce['address'] = '--'
    return HttpResponse (json.dumps(responce), content_type="application/json")

# * create new order
def create_order(request):

    try:
        #  get request data
        requestData = json.loads(request.body)
        
        # create empty data list
        order_data = {
            'user_id': request.user.pk,
            'total_carat': 0,
            'total_price': 0,
            'pay_within': 0,
            'p_ct_offer': 0,
            'total_price_offer': 0,
            'hold_hours': 0,
            'order_number': request.user.id,
            'diamonds_list': json.dumps([])
        }

        # -- cart
        try:
            cart = CartModal.objects.get(user_id=request.user.id)
        except:
            return HttpResponse (json.dumps({
                'alert': 'empty'
            }), content_type="application/json")

        user_cart = json.loads(cart.user_cart)
        cart_diamonds = Diamond_Model.objects.filter(pk__in=user_cart)
        cart.delete()

        # order - price , carat, len
        order_data['total_diamonds'] = len(cart_diamonds)
        for diamond in cart_diamonds:
            order_data['total_carat'] += diamond.weight
            order_data['total_price'] += diamond.sale_price
        order_data['total_carat'] = round(order_data['total_carat'], 2)

        # order info
        for key in requestData:
            if key != 'comment':
                order_data[key] = int(requestData[key])
            else:
                order_data[key] = requestData[key]

        # -- make order
        new_order = Orders_model.objects.create(**order_data)
        order_number = new_order.id
        length = 10 - len(f'{order_number}')
        while length:
            length -= 1
            order_number = '0' + f'{order_number}'
        order_data['order_number'] = order_number
        new_order.order_number = order_number
        new_order.save()

        # -- Order diamonds list
        order_keys = []
        for diamond in cart_diamonds:
            filter_diamonds_values = {
                'stock': diamond.stock,
                'certificate': diamond.certificate,

                'shape': diamond.shape,
                'clarity': diamond.clarity,
                'color': diamond.color,
                'culet': diamond.culet,
                'cut': diamond.cut,
                'polish': diamond.polish,
                'symmetry': diamond.symmetry,
                'girdle': diamond.girdle,
                'fluor': diamond.fluor,
                'measurements': diamond.measurements,
                'lab': diamond.lab,

                'photo': diamond.photo,
                'video': diamond.video,

                'rap_1ct': diamond.rap_1ct,
                'sale_price': diamond.sale_price,
                'disc': diamond.disc,

                'weight': diamond.weight,
                'length_mm': diamond.length_mm,
                'width': diamond.width,
                'depth': diamond.depth,
                'lw': diamond.lw,
                'depth_procent': diamond.depth_procent,
                'table_procent': diamond.table_procent,

                'vendor_id': diamond.vendor_id,
                'buyer': request.user,
                'order_id': new_order.id,
                'order_number': order_number
            }
            Orders_Diamond_Model.objects.create(**filter_diamonds_values)
            order_keys.append(diamond.certificate)
        new_order.diamonds_list = json.dumps(order_keys)
        new_order.save()

        # -- ORDER EMAIL 
        user = request.user
        company = CompanyDetails.objects.get(user_id=user.id)
        manager = CustomUser.objects.get(pk=user.manager_id)
        manager_email = manager.email
        sales_mail = 'sales@labrilliante.com'

        # --> send email
        send_email({
            'subject': 'New order',
            'email': [manager_email, sales_mail],
            'template': '_mail_new_order.html',
            'context': {
                'login': user.username,
                'user_email': user.email,
                'user_tel': user.tel,
                'fname': user.first_name,
                'lname': user.last_name,

                'company_name': company.company_name,
                'company_tel': company.company_tel,
                'company_email': company.company_email,
                'company_address': company.company_address,

                'order_number': order_data['order_number'],
                'order_comment': requestData['comment'],
                'order_type': new_order.get_order_type_display(),
                'total_price': order_data['total_price'],
                'total_carat': order_data['total_carat'],
                'total_diamonds': order_data['total_diamonds'],
            }
        })

        responce = {
            'alert': 'success'
        }   
    except Exception as ex:
        print(ex)
        responce = {
            'alert': 'error'
        }
        
    return HttpResponse (json.dumps(responce), content_type="application/json")

# * order search form
def order_search(request):

    # <-- get values from request
    requestData = json.loads(request.body)
    search = requestData['search']
    date_from = requestData['date_from']
    date_to = requestData['date_to']

    # <-- get orders model
    orders_model = Orders_model.objects.filter(user_id=request.user.id)
    date = []
    time_zone = str(timezone.now())
    time_zone = time_zone[20:len(time_zone)]

    for item in orders_model:
        dateItem = item.created_at.strftime('%b-%d-%m-%Y')
        date.append(dateItem)
    
    # order number search
    if search != '0000000000':
        orders_model = orders_model.filter(order_number=search)

    # date search
    if date_from != '' and date_to != '':
        orders_model = orders_model.filter(created_at__range=[f'{date_from} 00:00:00.{time_zone}', f'{date_to} 23:59:59.{time_zone}'])
    elif date_from != '':
        orders_model = orders_model.filter(created_at__range=[f'{date_from} 00:00:00.{time_zone}', timezone.now()])
    elif date_to != '':
        orders_model = orders_model.filter(created_at__range=[f'2000-01-01 00:00:00.{time_zone}', f'{date_to} 23:59:59.{time_zone}'])

    # * create responce
    responce = {
        'orders': serializers.serialize('json', orders_model),
        'date': date
    }

    return HttpResponse (json.dumps(responce), content_type="application/json")

# * remove order
def order_remove(request):

    number = json.loads(request.body)

    try:
        order = Orders_model.objects.get(order_number = number)
        order.delete()
    except Exception as ex:
        print(ex)

    return HttpResponse (json.dumps({
        'alert': 'success',
        'number': number
    }), content_type="application/json")



# * ------------------------------------------------------------------- receiver for update order status
@receiver(pre_save, sender=Orders_model)
def on_change(sender, instance: Orders_model, **kwargs):
    if instance.id is None: # new object will be created
        pass # write your code here
    else:
        try:
            # send email message if level was update
            previous = Orders_model.objects.get(id=instance.id)

            if previous.order_status != instance.order_status:

                user = CustomUser.objects.get(id = instance.user_id)

                send_email({
                    'subject': 'Order status was updated',
                    'email': [user.email],
                    'template': '_mail_order_status.html',
                    'context': {
                        'order_status': instance.get_order_status_display(),
                        'order_number': instance.order_number,
                    }
                })
            else:
                pass

        except:
            pass
                

            