from django.contrib import messages


def inspect_level(request, number = 0):

    falseMessage = 'Please fill in the necessary information in your profile details to start your diamond search' 

    if request.user.is_authenticated:
        if request.user.level >= number or request.user.is_superuser == 1:
            return True
        else:
            messages.error(request, falseMessage)
            return False
    else:
        messages.error(request, falseMessage)
        return False

def inspect_type(request, type_num):
    responce = False
    if request.user.is_authenticated:
        
        if request.user.user_type == type_num or request.user.is_superuser == 1:
            responce = True
        else:
            responce == False

        return responce
    else:
        return responce
