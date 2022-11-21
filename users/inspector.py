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
        if self.super:
            self.result = True

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

    # -- permissions
    def has_permission(self, permissions_list = [str]):
        result = False

        user_permissions = self.user.has_perms(permissions_list)
        groups_permissions = self.user.get_group_permissions()
        
        # check permissions
        group_result = 0
        for group_permission in groups_permissions:
            for permission in permissions_list:
                if permission == group_permission:
                    result += 1
                else:
                    continue
        
        # group permissions True
        if group_result == len(permissions_list):
            result = True

        # user permissions True
        if user_permissions:
            result = True

        return result