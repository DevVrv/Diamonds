from django.http import HttpResponse
from django.core import serializers
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
import json
# forms
from .models import Diamond_Model, MaxMin
from cart.models import CartModal

from users.inspector import Inspector

# import the logging library
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)

# <------------------------------ get filter page
def filterPage(request):

    permission = Inspector(request, { 'type': 1, 'level': 2 })
    if not permission.inspect():
        return redirect(reverse_lazy('user_info'))

    # * get cart items
    try:
        cart = CartModal.objects.get(user=request.user.pk)

        cart_value = json.loads(cart.user_cart)

        cart_len = len(cart_value)
    except:
        cart_len = 0

    # * get max min
    max_min = MaxMin.objects.all()

    query_set = Diamond_Model.objects.filter(is_published = 1).order_by('sale_price')

    best_diamonds = query_set.filter(best_selling=1)
    best_diamonds_responce = best_diamonds[0:45]

    result_diamonds_responce = query_set[0:45]
    
    context = {
        'title': 'Filter',
        'result_diamonds': result_diamonds_responce,
        'best_diamonds': best_diamonds_responce,
        'result_length': len(query_set),
        'best_length': len(best_diamonds),
        'cart_len': cart_len,
        'max_min': max_min
    }

    return render(request, 'filter.html', context)


# <------------------------------ filtering get filtered diamonds
def filtering(request):

    # <-- get filtered
    def get_filtered(requestData):

        # * get all diamonds
        diamonds = Diamond_Model.objects.filter(is_published = 1)

        # * get request items
        requestShapes = requestData['filter']['shape']
        requestNums = requestData['filter']['nums']
        requestLabs = requestData['filter']['lab']
        requestStr = requestData['filter']['strs']

        # * create filtered var
        filtered = False

        # --> filter by shapes
        if (requestShapes):
            if filtered == False:
                filtered = diamonds.filter(shape__in = requestShapes)

            elif filtered != False:
                filtered = filtered.filter(shape__in = requestShapes)
        
        # --> filter by labs
        if (requestLabs):
            if filtered == False:
                filtered = diamonds.filter(lab__in = requestLabs)

            elif filtered != False:
                filtered = filtered.filter(lab__in = requestLabs)

        # --> filter by nums
        if (requestNums):

            # conver nums to lte / gte
            nums = {}
            
            for key in requestNums:

                key = key.lower()

                # create lte / gte keys 
                key_gte = key + '__gte';
                key_lte = key + '__lte';
                
                # update nums list
                nums[key_gte] = float(requestNums[key][0])
                nums[key_lte] = float(requestNums[key][1])

            if filtered == False:
                filtered = diamonds.filter(**nums)

            elif filtered != False:
                filtered = filtered.filter(**nums)

        # --> filter by strs
        if (requestStr):

            # conver strs keys to __in
            strs = {}
            for key in requestStr:
                strs[key + '__in'] = requestStr[key]

            # Forming abbreviations
            cut = {}
            if key != 'clarity' and key != 'color':
                arr = []
                for str in requestStr[key]:
                    space = str.find(' ')
                    if space != -1:
                        space += 1
                        arr.append(f'{str[0:1]}{str[space:space+1]}'.upper())
                    else:
                        arr.append(str[0:2].upper())
                        arr.append(f'{str[0]}{str[len(str)-1]}'.upper())

                cut[f'{key}__in'] = arr
           
            for key in strs:
                try:
                    cut_item = cut[key]
                    for item in cut_item:
                        strs[key].append(item)

                except KeyError:
                    continue

            if filtered == False:
                filtered = diamonds.filter(**strs)

            elif filtered != False:
                filtered = filtered.filter(**strs)   

        # * filtered
        if filtered == False: filtered = diamonds

        # * get filtered best
        best = filtered.filter(best_selling=1)

        # * create responce data
        responceData = {
            'result': filtered,
            'best': best
        }

        return responceData

    # <-- get sorted
    def get_sorted(requestData, result_queryset, best_queryset):
        
        # * create sort object
        sortObject = requestData['sort']
        # * sort result
        sortResult = sortObject['result']
        # * sort best
        sortBest = sortObject['best']
       
        # * ordering 
        resultSorted = result_queryset.order_by(*sortResult)
        bestSorted = best_queryset.order_by(*sortBest)

        return {
            'result': resultSorted,
            'best': bestSorted
        }

    # --> If Is Ajax
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        if request.method == 'POST':

            # * get request data
            requestData = json.loads(request.body)

            # * ordering
            ordering_result = requestData['requestOrdering']['result']
            ordering_best = requestData['requestOrdering']['best']

            # * filtered diamonds
            filtered = get_filtered(requestData) 
            resultFiltered = filtered['result']
            bestFiltered = filtered['best']

            # * sort diamonds
            sortedDiamonds = get_sorted(requestData, resultFiltered, bestFiltered)
            resultFiltered = sortedDiamonds['result']
            bestFiltered = sortedDiamonds['best']

            # * comparison sort result
            if requestData['sort']['compare']['result'] is not False:

                compares = resultFiltered.filter(pk__in = requestData['comparing'])
                diamonds = resultFiltered.exclude(pk__in = requestData['comparing'])
                order = requestData['sort']['compare']['result']
                
                list_compares = list(reversed(compares))
                if order == 'compare':
                    list_diamonds = list(reversed(diamonds))

                    for compare in list_compares:
                        list_diamonds.append(compare)

                    list_diamonds = list(reversed(list_diamonds))

                elif order == '-compare':
                    list_diamonds = list(diamonds)
                    for compare in list_compares:
                        list_diamonds.append(compare)
                    
                resultFiltered = list_diamonds


            # * comparison sort best
            if requestData['sort']['compare']['best'] is not False:

                compares = bestFiltered.filter(pk__in = requestData['comparing'])
                diamonds = bestFiltered.exclude(pk__in = requestData['comparing'])
                order = requestData['sort']['compare']['best']
                
                list_compares = list(reversed(compares))
                if order == 'compare':
                    list_diamonds = list(reversed(diamonds))

                    for compare in list_compares:
                        list_diamonds.append(compare)

                    list_diamonds = list(reversed(list_diamonds))

                elif order == '-compare':
                    list_diamonds = list(diamonds)
                    for compare in list_compares:
                        list_diamonds.append(compare)
                    
                bestFiltered = list_diamonds
            
            # <-- best diamonds 
            bestResponceLen = len(bestFiltered)
            bestFiltered = bestFiltered[ordering_best[0]:ordering_best[1]]

            # make responce best
            best = serializers.serialize('json', bestFiltered)
            bestLen = len(bestFiltered)    

            # <-- result diamonds
            resultResponceLen = len(resultFiltered)
            resultResponce = resultFiltered[ordering_result[0]:ordering_result[1]]

            # make responce result
            result = serializers.serialize('json', resultResponce)
            resultLen = len(resultResponce)
            
            # @ creqte responce data
            current_key = requestData['currentKey']

            if current_key == 'all':
                responceData = {
                    'result': result,
                    'resultLen': resultLen,
                    'best': best,
                    'bestLen': bestLen,
                    'resultResponceLen': resultResponceLen,
                    'bestResponceLen': bestResponceLen,
                }
            elif current_key == 'result':
                responceData = {
                    'result': result,
                    'resultLen': resultLen,
                    'resultResponceLen': resultResponceLen,
                }
            elif current_key == 'best':
                responceData = {
                    'best': best,
                    'bestLen': bestLen,
                    'bestResponceLen': bestResponceLen,
                }
            
            # --> return responce json
            return HttpResponse(json.dumps(responceData), content_type="application/json")


# <------------------------------ get diamond of keys
def filtering_of_key(request):

    if request.method == 'POST':

        # <-- get request data
        requestData = json.loads(request.body)
        # <-- get comparison keys
        keys = requestData['comparing']
        # <-- get comparison sort
        sort = requestData['sort']['comparison']

        # * make queryset
        filtered = Diamond_Model.objects.filter(pk__in=keys).filter(is_published = 1).order_by(*sort)
        for_responce = filtered

        if requestData['sort']['compare']['comparison'] != False:
            order = requestData['sort']['compare']['comparison']
            selected_pks = requestData['comparisonSelected']
            selected = filtered.filter(pk__in=selected_pks)
            others = filtered.exclude(pk__in=selected_pks)
            
            if order == 'compare':
                for_responce = selected.union(others)

            elif order == '-compare':
                for_responce = others.union(selected)
    
        responce = serializers.serialize('json', for_responce)

        return HttpResponse (responce, content_type="application/json")

