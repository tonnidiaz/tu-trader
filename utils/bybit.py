from time import sleep
from pybit.unified_trading import HTTP, WebSocket
from utils.functions import err_handler
import pandas as pd
import json


class ByBit:

    api_key = "QzStEmc9NoDRyPAulg"
    api_secret = "XCTG20xrrx01LVKX4IlN0RSiIaTXhvlYpwnK"
    client = HTTP(testnet=False, demo=True, api_key=api_key, api_secret=api_secret)
    category = "spot"
    symbol, interval = "BTCUSDT", 15
    acc_type = "UNIFIED"
    usdt_bal, btc_bal = 0, 0
    ws : WebSocket

    def __init__(self) -> None:
        print("ByBit initialized")

    
    def handle_message(self, message):
        print("ON WS MESSAGE")
        print(message)
    

    def get_balance(self, coin="USDT"):

        try:

            print("GETTING WALLET BALANCE...")
            res = self.client.get_wallet_balance(accountType=self.acc_type)

            unified_acc = filter(
                lambda x: x["accountType"] == self.acc_type, res["result"]["list"]
            )
            coin_bal = list(
                filter(lambda x: x["coin"] == coin, list(unified_acc)[0]["coin"])
            )[0]["availableToWithdraw"]
            return coin_bal

        except Exception as e:
            err_handler(e)

    def place_order(self):
        try:

            # res= self.client.place_batch_order()
            res = self.client.place_order(
                category=self.category,
                symbol=self.symbol,
                side="Sell",
                orderType="Market",
                qty='0.003259',
                takeProfit='63600',
                #stopLoss='62000'
                #price=61368,
          
            )
            """       timeInForce="GoodTillCancel",  # Time in force
                reduceOnly=False,  # Reduce only flag
                closeOnTrigger=False,
                slTriggerBy='LastPrice',
                slOrderType = 'Market' """
            print(res)
        except Exception as e:
            err_handler(e)

    def get_open_orders(self):

        try:
            print("GETTING OPEN ORDERS...")
            res = self.client.get_open_orders(
                category=self.category, symbol=self.symbol
            )
            list_orders = res["result"]["list"]
            return list_orders
        except Exception as e:
            err_handler(e)


bybit: ByBit