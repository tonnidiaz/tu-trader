import json
from time import sleep
from utils.functions import (
    back_test2,
    chandelier_exit,
    divide_chunks,
    find_recent_swing_low,
    get_klines,
    heikin_ashi,
    parse_klines,
)
from utils.time_func import date_str_to_timestamp
import pandas as pd
from utils.mongo import TuMongo
import sys

TuMongo()


class Data:
    klines: list
    df: pd.DataFrame
    balance: float
    position: bool = False
    strict = False
    use_swing_low = True
    symbol = "ETHUSDT"
    p_gain = 1.5 / 100  # 1% percentage gain


data = Data()
sym = "ETHUSDT"
fp = "data/klines/bybit/ETH-MARCH-MAY.json"
fp_2023 = "data/klines/bybit/ETHUSDT-2023-01-1.json"
fp_1hr = "data/klines/bybit/ETH-MARCH-MAY-1h.json"

def m_get_klines():
    start = date_str_to_timestamp("2023-05-13 20:00:00")
    get_klines(start=start, symbol=sym, save_fp=fp_1hr)

df_path ='data/dfs/ETH-splited.csv'

def main():

    df = pd.read_csv(
        df_path
    )  # chandelier_exit(heikin_ashi(parse_klines(klines))).to_csv(f"{fp}.csv")

    bal = 1000 / 19  # 260#117#1000/19 # 450
    start_bal = bal
    lev = 1

    num_years = 2

    for i in range(num_years * 1):
        new_bal = back_test2(df, balance=bal * lev, strict=data.strict)
        profit = new_bal - bal * lev
        new_bal = bal + profit
        profit = round(profit)
        bal = new_bal   + ((100*10) / 19) # Plus R100 every month
        print(f"\nMONTH {i + 1} BALANCE: {round(new_bal )}\tGained: {profit}\n")

    print(f"MADE ${bal} in {num_years} years from ${start_bal}")


""" 
for i, row in df.iterrows():
        start_index = i - (max_candles - 1) if i >= max_candles else 0
        sliced_df = df[start_index: i+1].reset_index()
        df.loc[i, 'swing_low'] = find_recent_swing_low(sliced_df['low'])
 """

def main2():
    print('PARSING DFS')
    with open(fp_1hr) as f:
        klines: list = json.load(f)
    klines.reverse()
    print(klines[0][0])
    #klines = klines[0:2000]
    
    chunks = list(divide_chunks(klines, 100))
    final_df: pd.DataFrame | None = None

    for chunk in chunks:
        df = chandelier_exit(heikin_ashi(parse_klines(chunk)))
        for i, row in df.iterrows():
            sliced_df = df[0 : i + 1]
            sliced_df = sliced_df.reset_index()
            df.loc[i, 'swing_low'] = find_recent_swing_low(sliced_df['low'])

        final_df = pd.concat([final_df, df], ignore_index=True)
    print("DONE PARSING KLINES")
    final_df.to_csv(df_path)
    # chandelier_exit(heikin_ashi(parse_klines(klines)), max_candles=300).to_csv(f"data/klines/bybit/ETHUSDT-2023-01-1.csv")


def show_df():
    df = pd.read_csv(df_path)
    for i, row in df.iterrows():
        if row['buy_signal'] == 1:
            print(f"{row['timestamp']}\t{row['swing_low']}")

#m_get_klines()
#main2()
args = sys.argv
act = args[1]

if act == 'show':
    show_df()
elif act == 'get':
    m_get_klines()
elif act == 'parse':
    main2()
else:
    main()