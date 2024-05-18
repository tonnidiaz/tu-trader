import json
from strategies.ce_sma_rsi import ce_sma_rsi
import pandas as pd
from data.data import data
from utils.functions import chandelier_exit, get_klines, heikin_ashi, parse_klines
from utils.time_func import date_str_to_timestamp
from utils.constants import klines_dir, dfs_dir

def get_n_parse(read_only = False):
    fname = f'{data.symbol}_{data.interval}m_{data.year}'
    fp = f'{klines_dir}/{fname}.json'
    df_fp = f'{dfs_dir}/{fname}.csv'
    if not read_only:
        klines = get_klines(start=date_str_to_timestamp(
            f'{data.year}-01-01 00:00:00'), end=date_str_to_timestamp(f'{data.year}-12-31 23:59:00'), save_fp=fp)
    
    with open(fp) as f:
        klines = json.load(f)

    df = chandelier_exit(heikin_ashi(parse_klines(klines)))
    df.to_csv(df_fp)
    return df

def year_backtest():
    fp = f'data/dfs/bybit/{data.symbol}_{data.interval}m_{data.year}.csv'
    bal = 300 / 19
    start_bal = bal
    lev = 1

    num_years = 3
    df = get_n_parse()
    m = '03'
    # df = df[(df['timestamp'] >= f'2023-{m}-01') & (df['timestamp'] < f'2023-{m}-32')  ]
    # show_df(df).to_csv('data/test/year.csv')

    for i in range(num_years * 1):

        print(f"YEAR {data.year} \t ${round(bal, 2)}\n")
        bal = ce_sma_rsi(df, bal, lev)

    print(f"MADE ${bal} from ${start_bal} with x{lev} Leverage")
year_backtest()
