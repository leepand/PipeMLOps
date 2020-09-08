import os
import peewee
import configparser
from peewee import *
from playhouse.pool import PooledMySQLDatabase

#PATH = lambda p: os.path.abspath(os.path.join(os.path.dirname(__file__), p))
#cf = configparser.ConfigParser()

#cf.read(PATH('../homepage.config'))

#cf.read('../homepage.config')
#DB_PASS = cf.get('config', 'DB_PASS')

DB_PASS=""

#db = PooledMySQLDatabase('PersonalHomepage', user='root', password=DB_PASS, host='localhost', port=3306)
db = PooledMySQLDatabase('stock_data', user='root', password=DB_PASS, host='localhost', port=3306)#autoconnect=False


class UnknownField(object):
    def __init__(self, *_, **__):
        pass


class BaseModel(Model):
    class Meta:
        database = db