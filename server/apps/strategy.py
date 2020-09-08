from stock_service.response import Response
from stock_service import app,auth
from flask_cors import cross_origin
from flask import request
import math
import traceback
from peewee import fn
import datetime

from stock_service.models.strategy import Strategy
from stock_service.models.login import user
from stock_service.models.strategy_member import StrategyMember
rsp = Response()



@app.route('/api/strategy/strategy_list',methods=['GET'])  
@cross_origin()
@auth.login_required
def strategy_list():
    page_size = 10
    page = request.args.get('page', 1, type=int)
    name = request.args.get('name', '')
    user_name = request.headers.get("User-Key")
    uid_query = user.select().where(user.login_name==user_name).dicts()[0]
    if uid_query:
        uid = uid_query["id"]
    else:
        uid=1
    #mems_strategy = StrategyMember.select().where(StrategyMember.mem_user==uid).dicts()
    #projects=[p["project"] for p in mems_proj]
    #print(projects,user_name,uid,"projects")
    #data = []

    if name:
        stra_Infos = Strategy.select().where(Strategy.name % '%{}%'.format(name)).order_by(Strategy.id.desc()).dicts()
    else:
        stra_Infos = Strategy.select().order_by(Strategy.id.desc()).dicts()

    total_cnt = stra_Infos.count()
    #page_all = math.ceil(total_cnt/page_size)
    #print(page_all,page,total_cnt,"page")
    data=[]
    if total_cnt>0:
        #data = [u for u in Proj_Infos.paginate(page,page_size) if u["user_id"]==uid]
        data = [u for u in stra_Infos.paginate(page,page_size)]
    page_all = math.ceil(len(data)/page_size)
    result = {"data":data,
            "page": page,
            "total": page_all}
    #print(result,"result")
    return rsp.success(result)

@app.route('/api/strategy/add_strategy',methods=['POST'])  
@cross_origin()
@auth.login_required
def add_strategy():
    stra_name = request.get_json()['name']
    stra_type = request.get_json()['type']
    stra_version = request.get_json()['version']
    description = request.get_json()['description']
    user_name = request.get_json()['user']
    uid_query = user.select().where(user.login_name==user_name).dicts()[0]
    if uid_query:
        uid = uid_query["id"]
    else:
        uid=1
    #max_exists_proj_id = Project.select(fn.MAX(Project.id)).scalar()+1
    # add project
    date_now = datetime.datetime.now()
    
    try:
        s_id = Strategy(name=stra_name,
                        version =stra_version,
                        strategy_type=stra_type,
                        description = description,
                        status = 0,
                        createTime = date_now,
                        user_id = uid
                       ).save()

        # add project owner--add project first
        _stra_id = Strategy.select(fn.MAX(Strategy.id)).scalar()

        StrategyMember(permissionType="超级管理员",
                       strategy=_stra_id,
                       mem_user=uid).save()

        return rsp.success("add strategy success!")
    except:
        exc_traceback = str(traceback.format_exc())
        #resq={"code":"999998","msg":exc_traceback}
        return rsp.failed(exc_traceback)
    
    
#生效项目
@app.route('/api/strategy/disable_strategy',methods=['POST'])  
@cross_origin()
@auth.login_required
def disable_strategy():
    strategy_id = request.get_json()['strategy_id']
    update_status=0
    pp = Strategy(status=update_status)
    user_name = request.get_json()['user_key']
    uid_query = user.select().where(user.login_name==user_name).dicts()[0]
    if uid_query:
        uid = uid_query["id"]
    else:
        uid=1
       
    is_strategy_mem=StrategyMember.select().where((StrategyMember.mem_user==uid),
                                              (StrategyMember.strategy_id==strategy_id)).dicts() 
    
    if len(is_strategy_mem)<1:
        return rsp.nopriv("无操作权限")
    pp.id = strategy_id
    pp.save()
    
    data ={"strategy_id":strategy_id}
    return rsp.success(data)


@app.route('/api/strategy/enable_strategy',methods=['POST'])  
@cross_origin()
@auth.login_required
def enable_project():
    strategy_id = request.get_json()['strategy_id']
    update_status=1

    user_name = request.get_json()['user_key']
    uid_query = user.select().where(user.login_name==user_name).dicts()[0]
    if uid_query:
        uid = uid_query["id"]
    else:
        uid=1
       
    is_strategy_mem=StrategyMember.select().where((StrategyMember.mem_user==uid),
                                              (StrategyMember.strategy_id==strategy_id)).dicts() 
    if len(is_strategy_mem)<1:
        return rsp.nopriv("无操作权限")
    
    pp = Strategy(status=update_status)

    pp.id = strategy_id
    pp.save()
    
    data ={"strategy_id":strategy_id}
    return rsp.success(data)

@app.route('/api/strategy/del_strategy',methods=['POST'])  
@cross_origin()
@auth.login_required
def del_strategy():
    ids= request.get_json()['ids']
    try:
        for i in ids:
            user_name = request.get_json()['user_key']
            uid_query = user.select().where(user.login_name==user_name).dicts()[0]
            if uid_query:
                uid = uid_query["id"]
            else:
                uid=1
            is_strategy_mem=StrategyMember.select().where((StrategyMember.mem_user==uid),
                                                     (StrategyMember.strategy_id==i)).dicts()
            
            if len(is_strategy_mem)<1:
                return rsp.nopriv("无操作权限")
            Strategy.delete().where(Strategy.id == i).execute()
            
        return rsp.success("成功")
    except:
        rsp.delprojfailed("策略不存在")
        
        
@app.route('/api/strategy/update_strategy',methods=['POST'])  
@cross_origin()
@auth.login_required
def update_strategy():
    strategy_name = request.get_json()['name']
    strategy_type = request.get_json()['type']
    strategy_version = request.get_json()['version']
    description = request.get_json()['description']
    #user_name = request.get_json()['user']
    strategy_id = request.get_json()['strategy_id']
    
    user_name = request.get_json()['user_key']
    uid_query = user.select().where(user.login_name==user_name).dicts()[0]
    if uid_query:
        uid = uid_query["id"]
    else:
        uid=1
       
    is_strategy_mem=StrategyMember.select().where((StrategyMember.mem_user==uid),
                                              (StrategyMember.strategy_id==strategy_id)).dicts()  
    if len(is_strategy_mem)<1:
        return rsp.nopriv("无操作权限")
    pp = Strategy(name=strategy_name,
                 version =strategy_version,
                 strategy_type=strategy_type,
                 description = description,
                )

    pp.id = strategy_id
    pp.save()
    
    
    return rsp.success("成功")
