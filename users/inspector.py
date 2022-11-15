from django.contrib import messages

class Inspector(object):
    
    def __init__(self, request, params):
        
        # <-- get request
        self.request = request

        # <-- get params values
        if params.get('level'):
            self.rules_level = params['level']
        else:
            self.rules_level = 0

        if params.get('type'):
            self.rules_type = params['type']
        else:
            self.rules_type = 0

        if params.get('is_auth'):
            self.rules_is_auth = params['is_auth']
        else:
            self.rules_is_auth = None

        if params.get('is_staff'):
            self.rules_is_staff = params['is_staff']
        else:
            self.rules_is_staff = None

        if params.get('is_super'):
            self.rules_is_super = params['is_super']
        else:
            self.rules_is_super = None
       
        # <-- get user data   
        self.get_user()

    # -- get user data method
    def get_user(self):
        if self.request.user.is_authenticated:
            self.user_email = self.request.user.email
            self.user_id = self.request.user.id
            self.user_level = int(self.request.user.level)
            self.user_type = int(self.request.user.user_type) 
            self.user_is_super = self.request.user.is_superuser 
            self.user_is_staff = self.request.user.is_staff
        return self 

    # -- inspect level for user
    def inspect_level(self):
        if self.request.user.is_authenticated:
            if int(self.user_level) < int(self.rules_level) and self.user_is_super != 1:
                return False
            else:
                return True
    
    # -- inspect type for user
    def inspect_type(self):
        if self.request.user.is_authenticated:
            if int(self.user_type) != int(self.rules_type) and self.user_is_super != 1:
                return False
            else:
                return True
    
    # -- inspect auth for user
    def inspect_auth(self):
        if self.request.user.is_authenticated:
            return True
        else:
            return False
    
    # -- has parmissions
    def permissions(self, value):
        return self.request.user.has_perm(value)
