import websocket
import _thread
import time
import rel
from utils.constants import bybit_ws_url

def on_message(ws, message):
    print(message)

def on_error(ws, error):
    print(error)

def on_close(ws, close_status_code, close_msg):
    print("### closed ###")

def on_open(ws):
    print("Opened connection")

websocket.enableTrace(True)

def start_order_ws():
   
    ws = websocket.WebSocketApp(f"{bybit_ws_url}/v5/order/realtime",
                              on_open=on_open,
                              on_message=on_message,
                              on_error=on_error,
                              on_close=on_close,
                              header={
                                  "X-BAPI-API-KEY": 'lfxGDLlHlBOnssJAr1'
                              })

    ws.run_forever(dispatcher=rel, reconnect=5)  # Set dispatcher to automatic reconnection, 5 second reconnect delay if connection closed unexpectedly
    rel.signal(2, rel.abort)  # Keyboard Interrupt
    rel.dispatch()