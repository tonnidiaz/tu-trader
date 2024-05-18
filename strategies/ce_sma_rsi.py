import pandas as pd
from utils.constants import MAKER_FEE_RATE, TAKER_FEE_RATE
from data.data import data

def ce_sma_rsi(df: pd.DataFrame, balance: float, lev = 1):

    pos = False
    cnt = 0

    p_gain = data.p_gain
    use_close = data.use_close
    start_bal = balance
    
    print("CE_SMA_RSI_2: BEGIN BACKTESTING...\n")
    for i, row in df.iterrows():

        if row['buy_signal'] ==1 and not pos and (row['sma_20'] > row['sma_50']  ) :
                pos = True
                #print(f"BAL: {balance}")
                balance *= lev
                #print(f"BALEV: {balance}\n")

                entry_price = row['close']
                tp = entry_price * ( 1 + p_gain)

                lowest_sma = min(row['sma_20'], row['sma_50'])
                sl = lowest_sma - data.sl_const
                base = balance / entry_price
                base -= base * TAKER_FEE_RATE

        elif pos and ( (row['sell_signal'] == 1 and (row['sma_20'] < row['sma_50'])) if use_close else (row['high'] >= tp or row['low'] <= sl) ):
            pos= False
            cnt += 1
            exit_price = row['close'] if use_close else (tp if row['high'] >= tp else sl) 
            new_balance = base * exit_price
            new_balance -= new_balance * MAKER_FEE_RATE
            profit =  new_balance - balance
            profit = round(profit, 2)
            new_balance= round(new_balance, 2)
            #print(f"SELL:\t{row['timestamp']}\t${round(exit_price, 2)}")
            #print(f"Made {round(profit, 2)}%")
            """ print(balance)
            print(new_balance) """
            #print(profit)
            balance = start_bal + profit
            #print(f'${start_bal} \t ${balance}\n')
            start_bal = balance

    print(f"TOTAL TRADES: {cnt}")
    return round(balance / lev, 2)
