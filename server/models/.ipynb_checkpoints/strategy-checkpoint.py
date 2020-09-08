import os
import peewee
import configparser
from peewee import *
from playhouse.pool import PooledMySQLDatabase
from .model_function import BaseModel

import datetime
from .login import user

"""
策略选股

id     编号

"""


class Strategy(BaseModel):
    """
    策略list
    """
    StrategyType = (
        ('短线', '短线'),
        ('长线', '长线'),
        ('超短T', '超短T')
    )
    name = CharField(max_length=50, verbose_name='策略名称')
    version = CharField(max_length=50, verbose_name='策略版本')
    strategy_type = CharField(max_length=50, verbose_name='策略类型', choices=StrategyType)
    description = CharField(max_length=1024, null=True, verbose_name='策略描述')
    status = BooleanField(default=False, verbose_name='状态')
    LastUpdateTime = DateTimeField(default=datetime.datetime.now, verbose_name='最近修改时间')
    createTime = DateTimeField(verbose_name='创建时间')
    user_id = ForeignKeyField(user, on_delete=None, null=True,verbose_name='创建人')

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.name

    class Meta:
        table_name = 'stock_strategy'



Strategy.create_table()