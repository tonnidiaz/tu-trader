import threading
from websocket import WebSocketApp, WebSocket
import json, time
from classes.OKX import okx
from utils.functions import err_handler, generate_login_signature


class TuWS:

    url: str

    def __init__(self) -> None:

        self.ws = WebSocketApp(
            self.url,
            on_message=self.on_msg,
            on_error=self.on_err,
            on_close=self.on_close,
            on_open=self.on_open,
        )

    def on_open(self, ws: WebSocket):
        print("ON OPEN")

    def on_msg(self, ws, msg):
        print("On msg")
        msg = json.loads(msg)
        print(msg)

    def on_err(self, ws, err):
        print("On Error")
        err_handler(err)

    def on_close(self, ws : WebSocket, _, __):
        print("SOCKET CLOSED",_, __)
        #self.connect()

    def run(self):
        self.ws.keep_running = True
        self.ws.run_forever()

    def connect(self):
        websocket_thread = threading.Thread(target=self.run)
        websocket_thread.start()


class PublicWS(TuWS):

    def __init__(self) -> None:
        self.url = "wss://wspap.okx.com:8443/ws/v5/business?brokerId=9999"
        super().__init__()

    def on_open(self, ws: WebSocket):
        ws.send(
            json.dumps(
                {
                    "op": "subscribe",
                    "args": [{"channel": "index-candle1m", "instId": okx.symbol}],
                }
            )
        )


class PrivateWS(TuWS):

    url = okx.ws_url_private

    def __init__(self) -> None:
        super().__init__()

    def on_open(self, ws: WebSocket):
        super().on_open(ws)
        # Login
        sign = generate_login_signature(okx.api_secret)
        ws.send(
            json.dumps(
                {
                    "op": "login",
                    "args": [
                        {
                            "apiKey": okx.api_key,
                            "passphrase": okx.passphrase,
                            "timestamp": int(time.time()),
                            "sign": sign,
                        }
                    ],
                }
            )
        )
        
    def on_msg(self, ws, msg):

        msg = json.loads(msg)
        
        if msg.get('event') == 'login' and msg.get('code') == '0':
            print("LOGGED IN")
            ws.send(
            json.dumps(
                {"op": "subscribe", "args": [{"channel": "orders", 'instType': 'SPOT'}]}
            )
        )
            
        else:
            print(msg)
                        