from utils.functions import (
    chandelier_exit,
    find_recent_swing_low,
    get_app,
    heikin_ashi,
    is_dev,
    parse_klines,
)
from test import main as test_main
import time, json
from datetime import datetime
from flask import Flask
from flask_apscheduler import APScheduler
from classes.OKX import OKX
from models.order_model import Order
from models.app_model import App
from dotenv import load_dotenv
from utils.functions2 import update_order
from utils.mongo import TuMongo
import gunicorn
import pandas as pd

g = gunicorn
load_dotenv()

# Init mongo
TuMongo()


def init():

    # Create app if not present
    apps = App.find().run()
    if not len(apps):
        # Creating new app
        App().save()
    else:
        print(apps[0])
    OKX.inst = OKX()


class Config:
    SCHEDULER_API_ENABLED = True


app = Flask(__name__)
app.config.from_object(Config)

scheduler = APScheduler()
init()
cnt = 0

def place_trade(amt: float | None = None, ts=None, price: float = 0, side="buy"):

    _app = get_app()
    orders = Order.find().run()
    okx : OKX = OKX.inst

    if amt is None:
        # GET THE USDT BALANCE AND USE 75 IF THIS IS FIRST ORDER
        print('\nFIRST ORDER\n')
        amt = okx.get_bal(ccy=_app.ccy)
    print(f"Avail amt: {amt}\n")

    if not amt:
        raise Exception("Amount not avail")

    # Trade half assets
    if side == "buy":
        if len(orders) == 0:
            amt = 75 if amt > 75 else amt
        else:
            last_order = orders[-1]
            amt = last_order.ccy_amt * (1 + last_order.profit / 100)

    else:
        # Sell all previously traded
        amt = orders[-1].base_amt

    print(f"PLACING A {side} order FOR [{amt}]\n")
    order_id = okx.place_order(amt, side=side, price=price)

    if not order_id:
        print("FAILED TO PLACE ORDER")
        return
    m_order = okx.get_order_by_id(order_id=order_id)

    # Save order
    if side == "buy":
        order = Order(
            buy_order_id=order_id,
            buy_price=price,
            buy_timestamp=str(ts),
            buy_fee=float(m_order["fee"]),
            ccy_amt=amt,
            side=side,
        )
    else:
        order = orders[-1]
        order.order_id = order_id
        order.sell_timestamp = str(ts)
        order.sell_fee = float(m_order["fee"])
        order.sell_price = price
        order.base_amt = amt
        order.side = side

    order.save()

    print("DB UPDATED\n")


TIME_CHECKER_JOB_ID = "TIME_CHECKER_JOB"

last_check_at: datetime | None = None
test = False



def check_n_place_orders():

    global cnt, last_check_at
    

    okx : OKX= OKX.inst
    now = datetime.now()
    curr_min = now.minute
    app = get_app()
    m_test = False#test and len(Order.find().run()) <= 2
    #print(f"CURR_MIN: [{curr_min}]\tTEST: {m_test}\n")

    prod_time_condition = (
        app.can_trade
        and curr_min % app.interval == 0
        and (
            f"{last_check_at.hour}:{last_check_at.minute}"
            != f"{now.hour}:{now.minute}"
            if last_check_at
            else True
        )
    )

    if m_test or prod_time_condition:
        last_check_at = datetime.now()
        scheduler.pause_job(TIME_CHECKER_JOB_ID)
        # Check orders
        orders = Order.find().run()
        is_closed, last_order = update_order(orders)

        klines = okx.get_klines()
        df = chandelier_exit(heikin_ashi(parse_klines(klines)))


        if is_dev():
            df.to_csv("data/df.csv")
            print("DF SAVED TO CSV FILE")

        print("CHECKING SIGNALS...\n")

        for i, row in df.tail(1).iterrows():

            if  is_closed and (
                row["buy_signal"] == 1 and (row["sma_20"] > row["sma_50"]) or m_test
            ):

                print("HAS BUY SIGNAL > GOING IN")
                entry_price = row["close"]
                place_trade(ts=row["timestamp"], price=entry_price)

            elif not is_closed and last_order.side == 'sell' and last_order.order_id == '' and (
                row["sell_signal"] == 1 and (row["sma_20"] < row["sma_50"]) or m_test
            ):

                print("HAS SELL SIGNAL > GOING OUT")
                place_trade(ts=row["timestamp"], price=row["close"], side="sell")
        print("RESUME JOB")
        scheduler.resume_job(TIME_CHECKER_JOB_ID)

@scheduler.task("interval", id=TIME_CHECKER_JOB_ID, seconds=1, misfire_grace_time=900)
def tc_job():

    # Checks to minute part of the current time
    # If min % 15 == 0 > check for buy signal
    # If last candle has buy signal and app.can_trade > place an order

    with scheduler.app.app_context():
        global cnt
        check_n_place_orders()
        cnt += 1


scheduler.app = app
scheduler.init_app(app)


@app.get("/")
def index():
    global cnt
    print(f"GETTING CNT  at {cnt}")
    return {"msg": "Hello there!", "cnt": cnt}


@app.get("/orders")
def orders_route():
    orders: list[Order] = Order.find().run()
    orders = list(map(lambda x: json.loads(x.model_dump_json()), orders))
    return orders

scheduler.start()

def main():
    if not test:
        return
    for i in range(3):
        check_n_place_orders()

if __name__ == "__main__":
    #main()
    #test_main()
    while True:
        time.sleep(2)
    # app.run( port=8000, debug=True)
