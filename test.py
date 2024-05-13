import json
from classes.OKX import okx
import pandas as pd

alg_id = '1437060041215057920'
id = '1442616768836665344'

df = pd.read_csv('data/klines/bybit/ETH-2023.csv')
print(df[3:5])