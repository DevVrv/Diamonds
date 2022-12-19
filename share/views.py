
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from share.models import ShareModel
from filter.models import Diamond_Model
from django.shortcuts import render
import json
import random
import string

# import the logging library
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)

# create share view
def create_share(request):

    # * get request body
    requestData =  json.loads(request.body)

    if len(json.dumps(requestData['comparing'])) != '0':
        # * share model
        letters = string.ascii_lowercase
        rand_string = ''.join(random.choice(letters) for i in range(8))

        shareKwargs = {
            'user_id': request.user.id,
            'share_type': requestData['share'],
            'share_list': json.dumps(requestData['comparing']),
            'share_key': rand_string
        }
        shareModel = ShareModel.objects.filter(user_id = request.user.id)
        if not shareModel.exists():
            shareModel.create(**shareKwargs)
        else:   
            shareModel.update(**shareKwargs)

        # * create share link
        share_link = f'{request.build_absolute_uri()}{request.user.id}/{shareModel[0].id}/{shareModel[0].share_key}/'
        share_link = share_link.replace('create', 'get')

        # * create responce data
        responceData = {
            'share_link': share_link,
            'message': 'success'
        }

        # <-- return responce
        return HttpResponse(json.dumps(responceData), content_type="application/json")
    else:
        # * create responce data
        responceData = {
            'message': 'list is empty'
        }

        # <-- return responce
        return HttpResponse(json.dumps(responceData), content_type="application/json")

# get share view
def get_share(request, user_id, share_id, share_key):
    
    # <-- get share items
    share = get_object_or_404(ShareModel, user_id=user_id, id=share_id, share_key=share_key)
    share_list = json.loads(share.share_list)
    share_type = share.share_type
    share_name = 'Share with price'
    if share_type == 0: share_name = 'Share without price'

    # <-- get diamonds items
    diamonds = list(Diamond_Model.objects.filter(pk__in=share_list))

    context = {
        'body_style': 'overflow-y: hidden;',
        'title': share_name,
        'diamonds': diamonds,
        'share_type': share_type
    }

    return render(request, 'share.html', context)
