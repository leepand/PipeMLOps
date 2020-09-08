import os
import peewee
from peewee import *
from playhouse.pool import PooledMySQLDatabase
from stock_service.models.model_function import BaseModel


"""
用户管理

id                编号
name              用户名称
login_name        登录名
password          登录密码
stable_salt       固定盐
salt              随机盐
salt_expire_time  随机盐过期时间
role_id           用户角色
email             邮箱
wechat_key        微信ID
is_valid          账号是否有效
create_time       创建时间
update_time       更新时间
"""

class user(BaseModel):
    name = CharField()
    login_name = CharField()
    password = CharField()
    stable_salt = CharField()
    salt = CharField()
    salt_expire_time = DateTimeField()
    role_id = IntegerField()
    email = CharField()
    wechat_key = CharField()
    is_valid = IntegerField()
    create_time = DateTimeField()
    update_time = DateTimeField()

    class Meta:
        table_name = 'user_accounts'


user.create_table()

