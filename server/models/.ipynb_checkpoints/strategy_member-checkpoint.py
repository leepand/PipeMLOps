import os
import peewee
import configparser
from peewee import *
from playhouse.pool import PooledMySQLDatabase
from .model_function import BaseModel

import datetime
from .login import user
from .strategy import Strategy
"""
策略成员管理

id                编号

"""




class StrategyMember(BaseModel):
    """
    策略项目成员
    """
    CHOICES = (
        ('超级管理员', '超级管理员'),
        ('策略开发人员', '策略开发人员'),
        ('测试人员', '测试人员')
    )
    permissionType = CharField(max_length=50, verbose_name='权限角色', choices=CHOICES)
    strategy = ForeignKeyField(Strategy, related_name='member_strategy', on_delete="CASCADE", verbose_name='所属策略')
    mem_user = ForeignKeyField(user, related_name='member_user', on_delete="CASCADE", verbose_name='用户')

    def __unicode__(self):
        return self.permissionType

    def __str__(self):
        return self.permissionType

    class Meta:
        table_name = 'strategy_member'

        
StrategyMember.create_table()