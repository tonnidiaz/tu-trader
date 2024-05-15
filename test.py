from bunnet import Indexed, init_bunnet, Document
from pymongo.mongo_client import MongoClient


class User(Document):
    fname: str = ''
    lname: str = ''
    email: Indexed(str, unique = True)
# Connect to MongoDB first. PyMODM supports all URI options supported by
# PyMongo. Make sure also to specify a database in the connection string:
url = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
client = MongoClient(url)
db = 'traded'
init_bunnet(database=client[db], document_models=[User])
print("MONGO INITIALIZED")

def main():

    user = User(email='emmy2@gmail.com', fname='John', lname='Doe')
    user.save()
main()