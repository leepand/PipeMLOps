import os
basedir = os.path.abspath(os.path.dirname(__file__))



class Config(object):
    
    FLASKY_ADMIN = os.environ.get('FLASKY_ADMIN')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    MODELS = [
        {
            "module_name": "iris_model.iris_predict",
            "class_name": "IrisModel"
        }
    ]


    #@staticmethod
    #def init_app(app):
    #    pass

class ProductionConfig(Config):
    DEBUG = False


class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):
    
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
    DEBUG = True
    
    



#class ProductionConfig(Config):
#    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
#        'sqlite:///' + os.path.join(basedir, 'data.sqlite')


config = {
    'production': ProductionConfig,
    'default': ProductionConfig
}

model_sdk="/Users/leepand/Downloads/github/vue/vue-admin-flask-example/algolink_ui_server/app2/serving/modelcloud-0.2.0.tar.gz"
remote_path = "/Users/leepand/Downloads/github/vue/vue-admin-flask-example/algolink_ui_server"
jupyter_project_path = "/Users/leepand/Downloads/github/vue/vue-admin-flask-example/algolink_ui_server/notebooks"
jupyter_configs_path = "/Users/leepand/Downloads/github/vue/vue-admin-flask-example/algolink_ui_server/algolink-server/jupyter_configs"