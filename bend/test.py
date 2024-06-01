# Define trading parameters
import time

rate = 3.02
symbol = 'DOGE/USDT'
grid_size = 10  # Number of levels in the grid
grid_spacing = 0.02  # 1% between levels

trade_amt = 50 / 18.5
max_amt = 1000 /18.5 # 500 ZAR




total_base  = 0
total_ccy = 0

class Order:
    lvl: float
    amt: float

class OrderBook:
    sell_orders: list[Order] = []
    buy_orders: list[Order] = []

    def create_buy_order(self, amt, lvl):
        order = Order()
        order.lvl = lvl
        order.amt = amt
        self.buy_orders.append(order)

    def create_sell_order(self, amt, lvl):
        order = Order()
        order.lvl = lvl
        order.amt = amt
        self.sell_orders.append(order)


orderBook  = OrderBook()
# Function to place grid orders
def place_grid_orders(base_price: float):
    global total_base, total_ccy
    # Generate grid levels
    grid_levels = [base_price * (1 + grid_spacing) ** i for i in range(-grid_size, grid_size + 1)]
    for level in grid_levels:
        try:
            # Place buy order below base price
            if level < base_price:
                if total_ccy> max_amt:
                    break
                order = orderBook.create_buy_order( trade_amt, level)
                total_ccy += trade_amt
                #print(f"Placed buy order at {level}")
            # Place sell order above base price
            else:
                if total_base> max_amt:
                    break
                order = orderBook.create_sell_order( trade_amt, level)
                total_base += trade_amt
                #print(f"Placed sell order at {level}")

        except Exception as e:
            print(f"Error placing order at {level}: {e}")

# Function to cancel all open orders
def cancel_all_orders():
    try:
        # open_orders = exchange.fetch_open_orders(symbol)
        # for order in open_orders:
        #     exchange.cancel_order(order['id'], symbol)
        print("Canceled all open orders")
    except Exception as e:
        print(f"Error canceling orders: {e}")

import pandas as pd

df = pd.read_csv("data/dfs/binance/2021/DOGEUSDT_15m.csv") 


total_base_amt = 0
total_ccy_amt = 0

def cancel_orders():
    orderBook.sell_orders = []
    orderBook.buy_orders = []

for i, row in df.iterrows():
    if row['open']:
        place_grid_orders(base_price=row['open'])
        print(len(orderBook.buy_orders), len(orderBook.sell_orders))
        for order in orderBook.buy_orders:
            if order.lvl <= row['high'] and order.lvl >= row['low']:
                # Buy at closing price
                base = order.amt / order.lvl 
                #print(f"\nBUYING DOGE [{base}] @ [${order.lvl}]")
                total_base_amt += base
                #print(f"TOTAL DOGE [{total_base_amt}]\n")
        for order in orderBook.sell_orders:
            if order.lvl <= row['high'] and order.lvl >= row['low']:
                # Sell at closing price
                ccy= order.amt
                #print(f"\nSELLING for [{ccy}]")
                total_ccy_amt += ccy
                #print(f"TOTAL ZAR [{total_ccy_amt}] at [{order.lvl}]\n")

print(f"USDT {total_ccy_amt}\tDOGE {total_base_amt}")