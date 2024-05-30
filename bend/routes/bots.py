import json
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from bunnet import PydanticObjectId
from models.bot_model import Bot
from models.user_model import User
from utils.funcs.auth import validate
from utils.funcs.orders import OrderPlacer
from utils.functions import err_handler, tuned_err
from utils.constants import scheduler

router = Blueprint("bots", __name__, url_prefix="/bots")

cnt = 0
def tu_job(op: OrderPlacer, id):
    with scheduler.app.app_context():
        print(f"JOB: {id}, RUN {op.cnt}")
        if op.cnt >= 10:
            scheduler.pause_job(id)

        op.set_cnt(op.cnt + 1)

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
            user=user.id, start_amt=float(body.get("amt"))
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

@router.post("/<id>/edit")
@jwt_required()
def edit_bot_route(id):
    try:
        bot = Bot.find_one(Bot.id == PydanticObjectId(id)).run()
        if not bot:
            return tuned_err(404, "Bot not found")
        
        fd = request.json
        key = fd.get('key')
        val = fd.get('val')

        if key == 'active':
            job_id = str(bot.id)

            # check if scheduler contains job
            bl = scheduler.get_job(job_id)

            # If deactivating n job is avail
            if bl and val == False:
                scheduler.remove_job(job_id)
                print("JOB REMOVED")

            elif val == True:
                print("\nResuming jon\n")
                if not bl:
                    # Add job if it does not exist already
                    op = OrderPlacer()
                    scheduler.add_job(job_id, lambda : tu_job( op, job_id) , trigger="interval", seconds= 1)
                else:
                    scheduler.resume_job(job_id)

        bot.set({fd.get('key'): fd.get('val')})
        return json.loads(bot.model_dump_json())
    except Exception as e:
        err_handler(e)
        return tuned_err()
    
@router.get('/<id>')
def get_bot_by_id(id):

    try:
        bot = Bot.find_one(Bot.id == PydanticObjectId(id)).run()
        if not bot:
            return tuned_err(404, "Bot not found")
        return json.loads(bot.model_dump_json())
    except Exception as e:
        err_handler(e)
        return tuned_err()