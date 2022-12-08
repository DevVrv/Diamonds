from django.core.exceptions import PermissionDenied
from django.contrib import messages
from django.contrib.messages import get_messages

class Inspector(object):
    
    def __init__(self, request, rules = {'level': None, 'type': None}):

        # base params
        self.request = request
        self.rules = rules
        self.message = messages

        #  get user
        self.user = request.user

        #  get user status
        self.auth = self.user.is_authenticated
        if self.auth:
            self.super = self.user.is_superuser
            self.level = self.user.level
            self.type = self.user.user_type
        
    # base user inspect
    def inspect(self):
        
        inspect_type = None
        inspect_level = None

        # auth inspect
        if self.auth:

            # super user
            if self.super:
                return True

            # user type
            if self.rules['type'] != None:
                if self.user.user_type == self.rules['type'] or self.user.user_type == 0:
                    inspect_type = True
                else:
                    raise PermissionDenied

            if self.rules['level'] != None:
                if int(self.user.level) >= int(self.rules['level']):
                    inspect_level = True
                else:
                    self.messages('error', 'Please fill in the necessary information in your profile details to start your diamond search')
                    return False

            if self.rules['type'] != None and self.rules['level'] != None:
                if inspect_type and inspect_level:
                    return True
            elif self.rules['type'] != None:
                if inspect_type:
                    return True
            elif self.rules['level'] != None:
                if inspect_level:
                    return True
            else:
                return False
        else:
            return False

    # user permissions inspect
    def has_permissions(self, permissions_list = [str]):

        user_permissions = self.user.get_all_permissions()
        user_result = 0
        
        for user_permission in user_permissions:
            for permission in permissions_list:
                if user_permission == permission:
                    user_result += 1

        if user_result == len(permissions_list):
            return True
        else:
            raise PermissionDenied()

    # messages
    def messages(self, message_type, text):
        
        storage = get_messages(self.request)

        if message_type == 'error':
            for message in storage:
                if message == text:
                    return False
            messages.error(self.request, text)

        if message_type == 'success':
            for message in storage:
                if message == text:
                    return False
            messages.success(self.request, text)

        if message_type == 'warning':
            for message in storage:
                if message == text:
                    return False
            messages.warning(self.request, text)