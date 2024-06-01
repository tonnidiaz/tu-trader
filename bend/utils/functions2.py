# Place buy order
#   Check order status using buy_order_id
#   If order is not filled: Cannot place sell order
#   If order is filled: Can place sell order
# Place sell order
#   Change Order.side to sell
#   Add order_Id
#   Check status
# If closed: Update Order.status

from datetime import datetime
import re
from classes.OKX import OKX
from models.bot_model import Bot
from models.order_model import Order
from utils.funcs.orders import OrderPlacer
from utils.constants import scheduler


def is_email(text):
    return re.fullmatch(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b',
				 text)

def tu_job(op: OrderPlacer, bot: Bot, id):
    with scheduler.app.app_context():
        """ print(f"JOB: {id}, RUN {op.cnt}")
        if op.cnt >= 10:
            scheduler.pause_job(id) """
        op.check_n_place_orders(bot)
        op.set_cnt(op.cnt + 1)


def add_bot_job(bot: Bot):
    op = OrderPlacer()
    job_id = str(bot.id)
    print(f"\nAdding job for bot: {bot.name}\n")
    scheduler.add_job(job_id, lambda : tu_job( op, bot, job_id) , trigger="interval", seconds= 1)