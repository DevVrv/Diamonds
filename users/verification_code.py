import random

def create_code(request, email, remember = False):
    code = random.randint(100000, 999999)
    request.session['code'] = code
    request.session['email'] = email
    request.session['remember'] = remember
    return code