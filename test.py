import json
from classes.OKX import okx
import pandas as pd
from strategies.ce_sma import back_test as ce_sma_backtest
from utils.functions import chandelier_exit, get_klines, heikin_ashi, parse_klines
from utils.time_func import date_str_to_timestamp

alg_id = '1437060041215057920'
id = '1442616768836665344'
df_path = 'data/df'#OKX 1 MONTH DATA

bybit_klines_fp = 'data/klines/bybit/ETH-2024-04-28.json'
def m_back_test():

    bal = 1000 / 19
    start_bal = bal
    lev = 1

    num_years = 3
    df = pd.read_csv(f'{df_path}.csv')

    for i in range(num_years * 12):
        new_bal = ce_sma_backtest(df, balance=bal * lev)
        profit = new_bal - bal * lev
        new_bal = bal + profit
        profit = round(profit)
        bal = new_bal#   + ((100*10) / 19) # Plus R100 every month

    print(f"MADE ${bal} in {num_years} years from ${round(start_bal, 2)}\tGAIN: ${round(new_bal - start_bal, 2)}")

#m_back_test()
def get_n_parse():
    with open('data/klines/bybit/ETHUSDT.json') as f:
        klines = json.load(f)
    klines.reverse()
    chandelier_exit(heikin_ashi(parse_klines(klines))).to_csv(df_path)  
    print("DONE")

#m_back_test()


#klines = get_klines(start=date_str_to_timestamp('2024-04-28 12:30:00'), interval=15, symbol='ETHUSDT', save_fp=klines_fp)

""" with open(klines_fp) as f:
    klines = json.load(f)

klines.reverse()
chandelier_exit(heikin_ashi(parse_klines(klines))).to_csv(f'{klines_fp}.csv') """

m_back_test()