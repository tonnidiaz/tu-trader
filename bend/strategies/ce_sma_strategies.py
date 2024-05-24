import pandas as pd
from strategies.funcs import strategy
from data.data import data

def str_1(df: pd.DataFrame, balance: float, lev = 1, p_gain = None):

    """ Exits on every sell signal """
    print('\nUSING STRATEGY 1\n')
    def buy_cond(row):
        return row['buy_signal'] ==1 and ( row['sma_20'] is not None and row['sma_50'] is not None and row['sma_20'] > row['sma_50']  )
    
    def sell_cond(row, tp, sl):
        return row['sell_signal'] == 1

    m_data = strategy(df,balance, buy_cond, sell_cond, lev, p_gain if p_gain else data.p_gain)
    return  m_data

def str_2(df: pd.DataFrame, balance: float, lev = 1, p_gain = None):

    """ Exists when stop loss / take profit is reached """
    print('\nUSING STRATEGY 2\n')
    def buy_cond(row):
        return row['buy_signal'] ==1 and ( row['sma_20'] is not None and row['sma_50'] is not None and row['sma_20'] > row['sma_50']  )
    
    def sell_cond(row, tp, sl):
        return row['high'] >= tp or row['low'] <= sl

    m_data = strategy(df,balance, buy_cond, sell_cond, lev, p_gain if p_gain else data.p_gain)
    return  m_data

def str_3(df: pd.DataFrame, balance: float, lev = 1, p_gain = None):

    """ Exists when SMA_20 > SMA_50 """
    print('\nUSING STRATEGY 3\n')
    def buy_cond(row):
        return row['buy_signal'] ==1 and ( row['sma_20'] is not None and row['sma_50'] is not None and row['sma_20'] > row['sma_50']  )
    
    def sell_cond(row, tp, sl):
        return row['sma_20'] < row['sma_50']

    m_data = strategy(df,balance, buy_cond, sell_cond, lev, p_gain if p_gain else data.p_gain)
    return  m_data

def str_4(df: pd.DataFrame, balance: float, lev = 1, p_gain = None):

    """ Exists when SMA_20 > SMA_50 and also there is a sell signal """
    print('\nUSING STRATEGY 4\n')
    def buy_cond(row):
        return row['buy_signal'] ==1 and ( row['sma_20'] is not None and row['sma_50'] is not None and row['sma_20'] > row['sma_50']  )
    
    def sell_cond(row, tp, sl):
        return row['sell_signal'] and row['sma_20'] < row['sma_50']

    m_data = strategy(df,balance, buy_cond, sell_cond, lev, p_gain if p_gain else data.p_gain)
    return  m_data

def str_5(df: pd.DataFrame, balance: float, lev = 1, p_gain = None):

    """ Enters on every buy_signal and exits on every sell signal """
    print('\nUSING STRATEGY 5\n')
    def buy_cond(row):
        return row['buy_signal'] ==1 and ( row['sma_20'] is not None and row['sma_50'] is not None and row['sma_20'] > row['sma_50']  )
    
    def sell_cond(row, tp, sl):
        return row['sell_signal'] and row['sma_20'] < row['sma_50']

    m_data = strategy(df,balance, buy_cond, sell_cond, lev, p_gain if p_gain else data.p_gain)
    return  m_data

def main(df: pd.DataFrame, balance: float, str_num, lev = 1, p_gain = None):

    match str_num:
        case 1:
            print("Prints the values to a stream, or to sys.stdout by default.")
            return str_1(df, balance, lev, p_gain)
        case 2:
            print("Exists when stop loss / take profit is reached")
            return str_2(df, balance, lev, p_gain)
        case 3:
            print("Exists when SMA_20 > SMA_50")
            return str_3(df, balance, lev, p_gain)
        case 4:
            print("Exists when SMA_20 > SMA_50 and also there is a sell signal")
            return str_4(df, balance, lev, p_gain)
        case 5:
            print("Enters on every buy_signal and exits on every sell signal")
            return str_5(df, balance, lev, p_gain)
        case _:
            return None