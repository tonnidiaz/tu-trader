# TuTrader

- Coin = ETHUSDT
- Using ce_sma strategy -> 15m -> cashout at 1.5% -> sl -20

## TESTS [Balance = $52.63]

### OKX

- **1.5% - 15sl** ->  **$55.45**
- **1.5% - 20sl** ->  **$54.54**
- **1.5% - 25sl** ->  **$54.89**
- **1.5% - 30sl** ->  **$53.89**

#### 1 Month klines over 3 yrs
- **1.5% - 15sl** ->  **$344**

### BYBIT [Bal = $52.63, 3 yrs]
- **3% - 50sl** ->  **$252**
- **5% - 50sl** ->  **$374**
- **5% - 30sl** ->  **$473**
- **5% - 25sl** ->  **$712**

## Plan

- Check the time
- is_closed = True
- If time meets condition:
    - Check if theres an open position
        - if last_order:
            - is_closed = last_order.is_closed
            - if not is_closed:
                - order_id = last_order.order_id if last_order.side == 'sell' else last_order.buy_order_id
                - order = get_order_by_id(order_id)
                - _is_closed = order['state'] != 'live'

                - if last_order.side == 'buy':
                    - if _is_closed:
                        - Update last_order buy values and change side to 'sell'

                - elif last_order.side == 'sell':
                    - if _is_closed:
                        - is_closed = _is_closed
                        - update last_order sell values

    - Get klines and check for signals
    - If buy_signal and last_order.is_closed: 
        - Buy
    - elif sell_signal and not last_order.is_closed and last_order.side == 'sell' and last_order.order_id = '': # buy order was filled but sell order had not been placed yet
        - sell