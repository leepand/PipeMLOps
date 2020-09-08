from stock_service.response import Response
from stock_service import app,auth
from flask_cors import cross_origin
from flask import request
import math
import traceback
from peewee import fn
import datetime

import pandas as pd
import stock_service.libs.common as common
from stock_service.libs.bs_database import DataBase


rsp = Response()

class dataCenterDao:
    @staticmethod
    def query_node_list(offset, limit, date, search=None):
        dataBase = DataBase()
        sql = "select * from stock_data.guess_indicators_daily where 1=1 "
        param = []
        if date:
            sql += "and date = %s "
            param.append(date)
        if search:
            search = "%%%s%%" % (search)
            sql += "and (code like %s or name like %s)"
            param.append(search)
            param.append(search)

        sql += "order by code desc limit %s, %s"
        param.append(offset)
        param.append(limit)

        param = tuple(param)
        bRet, sRet = dataBase.query_data(sql, param)
        if not bRet:
            return False, sRet

        return True, sRet
    @staticmethod
    def query_node_count(date=None, search=None):
        dataBase = DataBase()
        sql = "select count(*) as cnt from stock_data.guess_indicators_daily where 1=1 "
        param = []

        if date:
            sql += "and date = %s"
            param.append(date)
        if search:
            search = "%%%s%%" % (search)
            sql += "and (code like %s or name like %s)"
            param.append(search)
            param.append(search)

        param = tuple(param)
        bRet, sRet = dataBase.query_data(sql, param)
        if not bRet:
            return False, sRet
        if len(sRet) !=1:
            return True, 0

        return True, sRet[0]['cnt']

@app.route('/api/data/data_list',methods=['GET'])  
@cross_origin()
@auth.login_required
def data_list():
    #print(request.args,'param')
    page_size = 10
    page = request.args.get('page', 1, type=int)
    name = request.args.get('name', '')
    user_name = request.headers.get("User-Key")
    
    date_now = datetime.datetime.now()
    date_now_str = "20200820"#date_now.strftime("%Y%m%d")
    datetime_int = date_now.strftime("%Y%m%d")
    
    length = page_size
    
    
    # 每天的 16 点前显示昨天数据。
    if date_now.hour < 16:
        date_now_str ="20200820"# (date_now + datetime.timedelta(days=-1)).strftime("%Y%m%d")
    
    search=name
    bRet, count = dataCenterDao.query_node_count(date_now_str, search=search)
    
    if not bRet:
        return False, count
    pg = common.Page(count, page, length)
    
    print(search,page,count,date_now_str,"sRet")
    bRet, sRet = dataCenterDao.query_node_list(pg.offset, pg.limit, date_now_str, search=search)
    

    
    result = {"data":sRet,
            "page": pg.page_index,
            "total": pg.page_count,}

    return rsp.success(result)
