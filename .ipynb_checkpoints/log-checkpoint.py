import functools,time,logging
logging.basicConfig(format='%(asctime)s - %(pathname)s[line:%(lineno)d] - %(levelname)s: %(message)s',
                    level=logging.INFO)
def log_func_time(func):
    @functools.wraps(func)
    def wrapper(*args,**kw):
        logging.info("Begin running : %s" % func.__name__)
        old_time = time.time()
        result = func(*args,**kw)
        logging.info("%s spent for %.4f s!" % (func.__name__,time.time()-old_time))
        logging.info("End running: %s \n",func.__name__)
        return result
    return wrapper
@log_func_time
def tim(l):
    time.sleep(5)
tim("10")
