from bunnet import Document, Indexed


class Order(Document):
    order_id : Indexed(str,  unique = True)
    buy_order_id: str = ''
    is_closed: bool = False
    buy_price : float
    sell_price: float= 0
    side: str = 'buy'
    buy_timestamp: str
    sell_timestamp: str = ''
    buy_fee: float = 0
    sell_fee: float = 0

    def __str__(self):
        return str({'order_id': self.order_id, 'is_closed': self.is_closed, 'bought_at': self.buy_price, 'sold_at': self.sell_price})