from datetime import datetime

date_str = "2024-04-28 02:00:00"
def date_str_to_timestamp(date_str: str):
    date_obj = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
    timestamp = round(date_obj.timestamp() * 1000)
    return timestamp