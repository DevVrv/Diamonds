from django.core.exceptions import PermissionDenied

class Inspector(object):
    
    def __init__(self, request, rules = {'level': None, 'type': None}, messages = {'error': None, 'success': None}):

        # base params
        self.request = request
        self.rules = rules

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
        
        # auth inspect
        if self.auth:

            # super user
            if self.super:
                return True

            # user type
            if self.rules['type'] != None and self.user.type == self.rules['type'] or self.user.type == 0:
                return True

            if self.rules['level'] != None and self.user.leve >= self.rules['level']:
                return True

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


