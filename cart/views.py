import json
import random
import string

from mail.views import send_email

from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse_lazy


from users.models import CustomUser
from .models import CartModal
from filter.models import Diamond_Model
from cart.models import CartModal

from users.inspector import Inspector
from django.http import HttpResponseNotFound

# import the logging library
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)

# <-- get cart template
def cart(request):

    permission = Inspector(request, {'level': 2, 'type': 1})
    if not permission.inspect():
        return redirect(reverse_lazy('user_info'))

    try:
        cart_items = CartModal.objects.get(user = request.user.pk)
        cart_values = json.loads(cart_items.user_cart)

        diamonds = Diamond_Model.objects.filter(pk__in=cart_values)

        # get total carat
        total_carat = 0 
        total_price = 0
        
        for diamond in diamonds:
            total_carat += diamond.weight
            total_price += diamond.sale_price
        
        context = {
            'total_price': total_price,
            'total_stone': len(diamonds),
            'total_carat': round(total_carat, 2),
            'diamonds': diamonds,
            'title': 'Cart',
            'cart_len': len(diamonds)
        }
    except:
        context = {
            'total_price': 0,
            'total_stone': 0,
            'total_carat': 0,
            'title': 'Cart',
            'cart_len': 0
        }

    return render(request, 'cart.html', context)

# -- delte selected from cart
def delete_selected(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        if request.method == 'POST':

            # get request data
            requestData = json.loads(request.body)
            
            # get model
            cart_values = CartModal.objects.get(user = request.user.pk).user_cart

            # remove diamonds from cart model
            user_cart = json.loads(cart_values)

            # create new cart data
            pks = []
            for pk in user_cart:
                if pk not in requestData:
                    pks.append(pk)

            # create new user cart 
            new_cart = json.dumps(pks)
            
            # save new cart in db
            CartModal.objects.update(user_cart=new_cart)

            # get cart values
            cart_object = CartModal.objects.get(user=request.user)
            cart_items = json.loads(cart_object.user_cart)
            diamonds = list(Diamond_Model.objects.filter(pk__in=cart_items))

            total_price = 0
            total_carat = 0
            total_stone = len(cart_items)

            for diamond in diamonds:
                total_price += float(diamond.sale_price)
                total_carat += diamond.weight
            # crate responce
            response = {
                'total_price': round(total_price, 2),
                'total_carat': round(total_carat, 2),
                'total_stone': total_stone,
            }

            return HttpResponse (json.dumps(response), content_type="application/json")

# -- sort cart items
def cart_sort(request):
    
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        if request.method == 'POST':
            # requset data
            requestData = json.loads(request.body)

            # get cart items
            pks = CartModal.objects.get(user=request.user)
            cart = json.loads(pks.user_cart)
            
            # get diamonds
            diamonds = Diamond_Model.objects.filter(pk__in=cart)
            
            # sort diamonds
            responseDiamonds = diamonds.order_by(*requestData['sort'])

            # compare
            if requestData['compare']['key'] != False and len(requestData['compare']['nums']) != 0:
               
                compares = Diamond_Model.objects.filter(pk__in=requestData['compare']['nums'])
                responseDiamonds = responseDiamonds.exclude(pk__in=compares)

                if requestData['compare']['key'] == 'compare':
                    compares = list(reversed(compares))
                    responseDiamonds = list(reversed(responseDiamonds))

                    for compare in compares:
                        responseDiamonds.append(compare)

                    responseDiamonds = list(reversed(responseDiamonds))
                elif requestData['compare']['key'] == '-compare':
                    compares = list(reversed(compares))
                    responseDiamonds = list(reversed(responseDiamonds))
                    
                    for compare in compares:
                        responseDiamonds.append(compare)

            
            # serealize diamonds queryset
            if not requestData['compare']['key']:
                responce = serializers.serialize('json', responseDiamonds.reverse())
            else:
                responce = serializers.serialize('json', responseDiamonds)

            # return responce
            return HttpResponse (json.dumps(responce), content_type="application/json")

# --> Add to cart
def cart_pack(request):
    
    requestData = json.loads(request.body)
    response = {}
    # kwargs for create cart
    cart = {
        'user': request.user,
        'user_cart': json.dumps(requestData),
        'cart_link': ''
    }

    # get model items
    model_item = CartModal.objects.filter(user=request.user)

    # # get or create cart
    if not model_item.exists():
        model_item = CartModal.objects.create(**cart)
        response = {
            'cart_len': len(requestData),
            'update_len': len(requestData)
        }
    elif model_item.exists():

        temp = []
        updated_len = 0

        
        # get model values
        for item in model_item:
            model_values = json.loads(item.user_cart)
            for value in model_values:
                temp.append(value)

        # get request values
        for x in requestData:
            if x not in temp:
                temp.append(x)
                updated_len += 1
        
        cart = {
            'user': request.user,
            'user_cart': json.dumps(temp),
            'cart_link': ''
        }

        # update cart
        model = CartModal
        model.objects.filter(user=request.user.pk).update(**cart)
        
        response = {
            'cart_len': len(temp),
            'update_len': updated_len
        }

    return HttpResponse (json.dumps(response), content_type="application/json")

# --> Generate and send link to manager
def send_wish_list(request):
    def generate_random_string(length):
        letters = string.ascii_lowercase
        rand_string = ''.join(random.choice(letters) for i in range(length))
        return rand_string
    
    responce = {'alert': '', 'msg': ''}

    try: 
        requestData = json.loads(request.body)
        msg = requestData['msg']
        price = int(requestData['price'])
        stone = int(requestData['stone'])
        carat = float(requestData['carat'])
        
        user = request.user
        login = user.username
        user_email = user.email
        user_tel = user.tel
        fname = user.first_name
        lname = user.last_name
        title = f'{user.username} send new wish list'

        user_cart = CartModal.objects.get(user_id = user.id)
        link = f'{generate_random_string(8)}'
        user_cart.cart_link = link
        user_cart.save()

        manager = CustomUser.objects.get(id=user.manager_id)
        send_email({
            'subject': 'User was send new wish list',
            'email': [manager],
            'template': '_mail_user_wish_list.html',
            'context': {
                'price': price, 
                'stone': stone, 
                'carat': carat, 
                'login': login, 
                'user_email': user_email, 
                'user_tel': user_tel, 
                'fname': fname, 
                'lname': lname, 
                'title': title, 
                'link': f'{request.build_absolute_uri()}{user.id}/{link}'.replace('send_list', 'get_list'), 
                'msg': msg
            }
        })
        responce['alert'] = 'success'
        responce['msg'] = 'Your wish list was sended to your manager'
    except:
        responce['alert'] = 'error'
        responce['msg'] = 'Something was wrong'
    return HttpResponse(json.dumps(responce), content_type="application/json")

# --> Get link of wish list
def get_wish_list(request, user_id, key):
    
    context = {}
    user = CustomUser.objects.get(id=user_id)
    user_cart = CartModal.objects.get(user_id = user_id)
    cart_link = user_cart.cart_link

    if key == cart_link:
        cart_list = json.loads(user_cart.user_cart)
        diamonds = Diamond_Model.objects.filter(id__in=cart_list)
        context['diamonds'] = diamonds
        
    else:
        return HttpResponseNotFound()


    return render(request, 'wish_list.html', context)
