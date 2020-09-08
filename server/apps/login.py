from flask import jsonify,request
from stock_service import app,auth
from flask_cors import cross_origin
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import BadSignature, SignatureExpired

import datetime

from stock_service.models.login import user



@auth.verify_password
def check_pass(login_name, password):
    user_query = user.select().where(user.login_name == login_name).dicts()
    if len(user_query) == 0:
        response = {
            'code': 403,
            'msg': '用户名或密码错误！',
        }
        return (False, response)
    else:
        for row in user_query:
            password_without_salt = row['password']
            salt_expire_time = row['salt_expire_time']
            is_valid = row['is_valid']
            salt = row['salt']
            server_timestamp = datetime.datetime.now()
            if is_valid !=1:
                response = {
                    'code': 403,
                    'msg': '用户非生效中状态，禁止登录，请联系管理员',
                    'name': row['login_name'],
                    'token':None
                }
                return (False, response)
            else:
                if password == password_without_salt:
                    s = Serializer(app.config['SECRET_KEY'], expires_in=600)
                    token = s.dumps({'id': row['id']})
                    response = {'code': 200, 'msg': '验证成功！', 'name': row['login_name'], 'token': token.decode('ascii')}
                    return (True,response)
                else:
                    response = {
                        'code': 403,
                        'msg': '用户名或密码错误！',
                        'name': row['login_name'],
                        'token':None
                        
                    }
                    return (False, response)
                """if server_timestamp < salt_expire_time:
                    password2compare = cf.md5_it(password_without_salt + salt)
                    if password == password2compare:
                        response = {'code': 200, 'msg': '验证成功！', 'user_name': row['name'], 'login_name': row['login_name'], 'user_id': row['id']}
                        return (True, response)
                    else:
                        response = {
                            'code': 403,
                            'msg': '用户名或密码错误！',
                        }
                        return (False, response)
                else:
                    response = {
                        'code': 403,
                        'msg': '时间戳已过期，请刷新页面！',
                    }
                    return (False, response)"""
                
                
@app.route('/login/userLogin', methods=['POST'])
@cross_origin()
@auth.login_required
def userLogin():
    '''
        用户登录逻辑：
            用户表里相关字段有四个：用户密码、固定盐、随机盐、随机盐过期时间
            用户密码存储的是明文密码被MD5加密一次后，再加上固定盐，再MD5加密后的字段
            用户首先调用userLoginGetSalt接口获取固定盐和一个有过期时间的随机盐，随机盐会被存到后端数据库中，有效时间一分钟
            用户前端填写的密码将会MD5加密一次后，加上固定盐再MD5加密一次，再加上随机盐再加密一次，即：md5(md5(md5(password)+stable_salt)+random_salt)
            这样保证了传输过程中是加密的，且每一次传输的都是不一样的字符串
            后端收到用户发来的加密三次的密码后，会使用库里加了固定盐的密码和随机盐相加后MD5，与用户传来的密码相比较，一致则通过
    '''

    login_name = request.get_json()['login_name']
    password = request.get_json()['password']
    #is_generate_cookie = request.get_json()['is_generate_cookie']
    login_status, login_response = check_pass(login_name, password)
    login_response['user_key'] = login_name
    print(login_status, login_response,login_name,password,"logon")
    
    resp = jsonify(login_response)
    #resp.headers['Access-Control-Allow-Origin'] = '*'
    if login_status:  # 如果登录成功
        return resp
    else:
        return resp
