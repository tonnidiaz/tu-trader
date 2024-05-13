import pandas as pd

class Data:
    klines : list
    df : pd.DataFrame
    balance : float
    position: bool = False
    strict = False
    use_swing_low = True
    symbol = 'ETHUSDT'
    p_gain = 1.5 # 1% percentage gain