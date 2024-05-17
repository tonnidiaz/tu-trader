from classes.OKX import OKX
from utils.functions import chandelier_exit, heikin_ashi, parse_klines
from utils.time_func import date_str_to_timestamp


def main():
    okx: OKX = OKX.inst
    klines = okx.get_klines(end=date_str_to_timestamp("2024-05-17 07:15:00"))
    df = chandelier_exit(heikin_ashi(parse_klines(klines)))
    df.to_csv('data/dfs/okx/df.csv')
    print("DONE")

