from datetime import datetime
from classes.OKX import OKX
from models.bot_model import Bot
from classes.binance import Binance
from models.order_model import Order
from utils.constants import scheduler
from utils.functions import chandelier_exit, heikin_ashi, is_dev, parse_klines
from utils.functions2 import update_order
from strategies.main import strategies

test = True

def place_trade(bot: Bot, amt: float | None = None, ts=None, price: float = 0, side="buy"):

    orders = Order.find(Order.bot == bot.id).run()
    okx  = OKX(bot)

    if amt is None:
        # GET THE USDT BALANCE AND USE 75 IF THIS IS FIRST ORDER
        print('\nFIRST ORDER\n')
        amt = okx.get_bal(ccy=bot.ccy)
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
            bot=bot.id, base=bot.base, ccy=bot.ccy
        )

        
        bot.save()
        print("\nBuy order placed, Bot updated\n")
    else:
        order = orders[-1]
        order.order_id = order_id
        order.sell_timestamp = str(ts)
        order.sell_fee = float(m_order["fee"])
        order.sell_price = price
        order.base_amt = amt
        order.side = side

    order.save()
    if side == "buy":
        bot.orders.append(order.id)
    print("DB UPDATED\n")


class OrderPlacer:
    cnt = 0
    last_check_at: datetime | None = None
    def __init__(self) -> None:
        print("\nInit OrderPlacer...\n")
    def set_cnt(self, val):
        self.cnt = val
    
    def get_cnt(self):
        return self.cnt
    
    def check_n_place_orders(self, bot: Bot):

        binance : Binance= Binance(bot)
        now = datetime.now()
        curr_min = now.minute

        m_test = test and len(Order.find(Order.bot == bot.id).run()) <= 2
        if test:
            print(f"CURR_MIN: [{curr_min}]\tTEST: {m_test}\n")

        prod_time_condition = (
            bot.active
            and curr_min % bot.interval == 0
            and (
                f"{self.last_check_at.hour}:{self.last_check_at.minute}"
                != f"{now.hour}:{now.minute}"
                if self.last_check_at
                else True
            )
        )

        if m_test or prod_time_condition:
            self.last_check_at = datetime.now()
            scheduler.pause_job(str(bot.id))
            # Check orders
            orders = Order.find(Order.bot == bot.id).run()
            is_closed, last_order = update_order(bot, orders)

            klines = binance.get_klines(symbol=f"{bot.base}{bot.ccy}")
            df = chandelier_exit(heikin_ashi(parse_klines(klines)))


            if is_dev():
                df.to_csv("data/df.csv")
                print("DF SAVED TO CSV FILE")

            print("CHECKING SIGNALS...\n")

            for i, row in df.tail(1).iterrows():
                obj = {'ts': row['timestamp'], 'buy_signal' : row['buy_signal'], 'sell_signal': row["sell_signal"], 'sma_20': row['sma_20'], 'sma_50': row['sma_50']}
                print(f'\n{obj}\n')
                if  is_closed and (
                    row["buy_signal"] == 1 and (row["sma_20"] > row["sma_50"]) or m_test
                ):

                    print(f"HAS BUY SIGNAL > GOING IN: {last_order}")
                    amt = last_order.ccy_amt * (1 +  last_order.ccy_amt * last_order.profit / 100) if last_order is not None else None
                    place_trade(bot= bot,   ts=row["timestamp"], amt=amt)

                elif not is_closed and last_order.side == 'sell' and last_order.order_id == '':
                    
                    entry = last_order.buy_price
                    if  strategies[bot.strategy - 1].sell_cond(row, entry) or m_test:
                        print("HAS SELL SIGNAL > GOING OUT")
                        amt = last_order.base_amt
                        place_trade(bot=bot, ts=row["timestamp"], price=row["close"], side="sell", amt=amt)
                        
            print("RESUME JOB")
            scheduler.resume_job(str(bot.id))
