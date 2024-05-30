import json
from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from models.bot_model import Bot
from models.user_model import User
from utils.funcs.auth import validate
from utils.functions import err_handler, tuned_err
from utils.constants import scheduler

router = Blueprint("bots", __name__, url_prefix="/bots")

cnt = 0
def tu_job(id: str):
    global cnt
    print(f"JOB: {id}, RUN {cnt}")
    if cnt >= 4:
        scheduler.pause_job(id)

    cnt += 1
@router.post('/create')
@jwt_required()
def create_bot_route():
    try:
        sub = validate(request)['sub']
        user = User.find_one(User.email == sub['email']).run()
        body = request.json
        if not user:
            return tuned_err(401, "Unautorized")
        user = User.find_one(User.username == body.get("user")).run()
        base, ccy = body['pair'].split(',')

        bot = Bot(
            name=body.get('name'),
            desc=body.get('desc'),
            interval=int(body.get('interval')),
            strategy=int(body.get('strategy')),
            base=base, ccy=ccy,
            active=body.get('active'),
            demo=body.get('demo'),
            user=user.id, start_bal=float(body.get("amt"))
        )

        bot.save()
        print("BOT SAVED")
        user.bots.append(bot.id)
        user.save()
        print("USER SAVED")
        
        scheduler.add_job(str(bot.id), lambda : tu_job(str(bot.id)), trigger="interval", seconds = 1)
        if not bot.active:
            scheduler.pause_job(str(bot.id))
        print("JOB ADDED")

        bots = list(map(lambda x: json.loads(x.model_dump_json()), Bot.find_many(Bot.user == user.id).run()))
        return {"bots": bots}

    except Exception as e:
        err_handler(e)
        return tuned_err()

@router.get("/")
def get_apps_route():
    try:
        username = request.args.get('user')
        user = User.find_one(User.username == username).run()

        if not user:
            return tuned_err(404, "Page not found")

        bots = Bot.find(Bot.user == user.id).run() if username else Bot.find().run()
        bots = map(lambda x: json.loads(x.model_dump_json()), bots )
        bots = list(bots)
        return bots
    except Exception as e:
        err_handler(e)
        return tuned_err()