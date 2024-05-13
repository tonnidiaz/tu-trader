
from utils.functions import chandelier_exit, find_recent_swing_low, get_app,heikin_ashi, is_dev, parse_klines
import time, json
from datetime import datetime
from flask import Flask
from flask_apscheduler import APScheduler
from classes.OKX import okx, OKX
from models.order_model import Order
from models.app_model import App
from dotenv import load_dotenv
from utils.mongo import TuMongo
import gunicorn
import pandas as pd

g = gunicorn
load_dotenv()

# Init mongo
TuMongo()

def init():

    # Create app if not present
    global okx
    apps = App.find().run()
    if not len(apps):
        # Creating new app
        App().save()
    else:
        print(apps[0])      
    okx = OKX()

class Config:
    SCHEDULER_API_ENABLED = True

app = Flask(__name__)
app.config.from_object(Config)

scheduler = APScheduler()
init()

cnt = 0

def main():
    # Check if there's any open orders
    # back-test and check for a buy signal
    # place an order if signal == 1
    ## Order placed at current price - a few digits
    # Update position status
    # Listen to changes in position
    # if filled, place sell order @ exit price
    # Repeat
    pass


def place_trade(amt : float | None = None, ts = None, lowest_sma: float = 0):

    # Place a buy market order 
    # Update pos status to false
    # Get the entry_price using orderId
    # calc exit prices
    # place sell order
    # update positon status to True

    _app = get_app()

    if amt is None:
        amt = okx.get_bal()
    if not amt:
        raise Exception("Amount not avail")
    
    # Trade half assets
    amt = amt / 2 if amt > 50 else amt
    
    print(f"PLACING A TRADE FOR [{amt}]")
    order_id = okx.place_order(amt)
    if not order_id:
        print("FAILED TO PLACE ORDER")
        return
    
    order = okx.get_order_by_id(order_id = order_id)
    entry_price = float(order['fillPx'])
    fill_sz = float(order['fillSz'])

    tp = entry_price * (1 + _app.p_gain)
    
    sl = lowest_sma - _app.sl_const

    # Place sell OCO order
    sell_order_id = okx.place_order(fill_sz, sl=sl, tp = tp, side='sell')
    if not order_id:
        print("COULD NOT PLACE SELL OCO ORDER")
        return
    
    # Save order
    order = Order(order_id=sell_order_id,buy_order_id=order_id, buy_price=entry_price, buy_timestamp=str(ts), buy_fee= float(order['fee']))
    order.save()

    print("DB UPDATED")
    
TIME_CHECKER_JOB_ID = "TIME_CHECKER_JOB"

last_check_at : datetime | None= None
test = False

@scheduler.task('interval', id=TIME_CHECKER_JOB_ID, seconds=1, misfire_grace_time=900)
def tc_job():

    # Checks to minute part of the current time 
    # If min % 15 == 0 > check for buy signal
    # If last candle has buy signal and app.can_trade > place an order

    with scheduler.app.app_context():
        global cnt, last_check_at
        now = datetime.now()
        curr_min = now.minute
        
        app = get_app()
        print(f"CURR_MIN: [{curr_min}]")

        prod_time_condition = app.can_trade and curr_min % app.interval == 0 and (f'{last_check_at.hour}:{last_check_at.minute}' != f'{now.hour}:{now.minute}' if last_check_at else True)
        
        if test and False:
            if cnt > 1:
                scheduler.pause_job(TIME_CHECKER_JOB_ID)
                #klines = okx.get_klines()
                df = pd.read_csv('data/df.csv')#chandelier_exit(heikin_ashi(parse_klines(klines)))
                #df.to_csv('data/df.csv')
                print("DF CSVed")
                for i, row in df.tail(1).iterrows():
                    swing_low = find_recent_swing_low(df['low'])
                    buy_timestamp = row['timestamp']
                    print(f"SWING LOW: {swing_low}")
                    place_trade(swing_low = swing_low, ts = buy_timestamp)
                cnt = 0
                #scheduler.resume_job(TIME_CHECKER_JOB_ID)
                return
            cnt +=1
            return
        elif  (cnt > 1 if test else prod_time_condition) :
            last_check_at = datetime.now()
            scheduler.pause_job(TIME_CHECKER_JOB_ID)
            # Check orders
            orders = Order.find().run()
            last_order = None
            if len(orders) and not orders[-1].is_closed:
                last_order = orders[-1]

                res = okx.get_order_by_id(last_order.order_id)
                is_closed = res['state'] != 'live'

                print(f'closed: {is_closed}')
                last_order.sell_price = float(res['fillPx'])
                last_order.sell_timestamp = datetime.fromtimestamp(float(res['fillTime']) / 1000).strftime('%Y-%M-%d %H:%M:%S')
                last_order.is_closed = is_closed
                last_order.sell_fee = float(res['fee'])
                last_order.save()
        
            if (last_order.is_closed if last_order else True):
                scheduler.pause_job(TIME_CHECKER_JOB_ID)
                print("CHECKING FOR BUY_SIGNAL...")
                klines = okx.get_klines()
                df = chandelier_exit(heikin_ashi(parse_klines(klines)))
                if is_dev():
                    df.to_csv("data/df.csv")
                    print("DF SAVED TO CSV FILE")

                for i, row in df.tail(1).iterrows():
                    if row['buy_signal'] ==1 or test:

                        #scheduler.pause_job(TIME_CHECKER_JOB_ID)
                        print("HAS BUY SIGNAL > GOING IN")
                        swing_low = find_recent_swing_low(df['low'])
                        buy_timestamp = row['timestamp']
                        print(f"SWING LOW: {swing_low}")
                        lowest_sma = min(row['sma_20'], row['sma_50'])
                        place_trade(lowest_sma=lowest_sma, ts = buy_timestamp)

                if test == False:
                    scheduler.resume_job(TIME_CHECKER_JOB_ID)
            return
        cnt += 1

scheduler.app = app
scheduler.init_app(app)

@app.get('/')
def index():
    global cnt
    print(f"GETTING CNT  at {cnt}")
    return {'msg': 'Hello there!', 'cnt': cnt}

@app.get('/orders')
def orders_route():
    orders : list[Order] = Order.objects()
    orders = list(map(lambda x: json.loads(x.to_json()), orders))
    return orders

scheduler.start()

if __name__ == "__main__":

    while True:
        time.sleep(5)
    #app.run( port=8000, debug=True) 