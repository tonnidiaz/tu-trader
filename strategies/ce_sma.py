import pandas as pd
from utils.constants import MAKER_FEE_RATE, TAKER_FEE_RATE
from data.data import data

def back_test(df: pd.DataFrame, balance: float):

    pos = False
    cnt = 0

    p_gain = data.p_gain
    print("BEGIN BACKTESTING...")
    for i, row in df.iterrows():


        if row['buy_signal'] ==1 and not pos:
                pos = True
                entry_price = row['close']
                tp = entry_price * ( 1 + p_gain)

                lowest_sma = min(row['sma_20'], row['sma_50'])
                sl = lowest_sma - data.sl_const
                base = balance / entry_price
                base -= base * TAKER_FEE_RATE
                print(f"BUY:\t{row['timestamp']}")

        elif pos and (row['high'] >= tp or row['low'] <= sl):
            pos= False
            cnt += 1
            exit_price = tp if row['high'] >= tp else sl#row['close']
            
            profit = (exit_price - entry_price) / entry_price * 100
            balance = base * exit_price
            balance -= balance * MAKER_FEE_RATE
            print(f"SELL:\t{row['timestamp']}\tPROFIT: {round(profit, 2)}%\n")
            #print(f"Made {round(profit, 2)}%")

    print(f"TOTAL TRADES: {cnt}")
    return balance
