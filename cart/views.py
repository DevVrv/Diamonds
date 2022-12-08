import json
from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.contrib import messages

from .models import CartModal
from filter.models import Diamond_Model
from cart.models import CartModal

from users.inspector import Inspector

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
            responseDiamonds = diamonds.order_by(*requestData['order'])

            # compare
            if requestData['compare'] != False and len(requestData['compare']) != 0:

                compares = Diamond_Model.objects.filter(pk__in=requestData['compare'])
                responseDiamonds = responseDiamonds.exclude(pk__in=compares)

                if requestData['compare_order'] == 'compare':
                    compares = list(reversed(compares))
                    responseDiamonds = list(reversed(responseDiamonds))

                    for compare in compares:
                        responseDiamonds.append(compare)

                    responseDiamonds = list(reversed(responseDiamonds))
                
                elif requestData['compare_order'] == '-compare':
                    compares = list(reversed(compares))
                    responseDiamonds = list(reversed(responseDiamonds))
                    
                    for compare in compares:
                        responseDiamonds.append(compare)

            # serealize diamonds queryset
            responce = serializers.serialize('json', responseDiamonds)

            # return responce
            return HttpResponse (json.dumps(responce), content_type="application/json")

# --> Add to cart
def cart_pack(request):
    
    requestData = json.loads(request.body)

    # kwargs for create cart
    cart = {
        'user': request.user,
        'user_cart': json.dumps(requestData)
    }

    # get model items
    model_item = CartModal.objects.filter(user=request.user)

    # get or create cart
    if not model_item.exists():
        model_item = CartModal.objects.create(**cart)

        response = {
            'cart_len': len(requestData),
            'update_len': len(requestData)
        }
    elif model_item.exists():

        # arr for update values
        temp = []

        # len of update
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
            'user_cart': json.dumps(temp)
        }

        # update cart
        model = CartModal
        model.objects.filter(user=request.user.pk).update(**cart)
        
        response = {
            'cart_len': len(temp),
            'update_len': updated_len
        }

    return HttpResponse (json.dumps(response), content_type="application/json")
