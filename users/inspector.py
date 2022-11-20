class Inspector(object):
    
    def __init__(self, request, rules = {'level': None, 'type': None}):
        # -- base params
        self.request = request
        self.result = False
        self.rules = rules

        # <-- get user
        self.user = request.user

        # <-- get user status
        self.auth = self.user.is_authenticated
        if self.auth:
            self.id = self.user.id
            self.level = self.user.level
            self.super = self.user.is_superuser
            self.staff = self.user.is_staff
            self.type = self.user.user_type


    # -- inspect type and level
    def inspect(self):
        # -- super
        # if self.super:
        #     self.result = True

        # <-- get level
        try:
            rLevel = self.rules['level']
        except KeyError:
            rLevel = None

        # <-- get type
        try:
            rType = self.rules['type']
        except KeyError:
            rType = None        
        
        self.level_result = None
        if rLevel:
            if rLevel <= self.level:
                self.level_result = True
            else:
                self.level_result = False

        self.type_result = None
        if rType:
            if rType == self.type:
                self.type_result = True
            else:
                self.type_result = False

        if self.type_result and self.level_result:
            self.result = True
        else:
            self.result = False

        return self.result

    # -- is auth
    def is_auth(self):
        return self.auth  