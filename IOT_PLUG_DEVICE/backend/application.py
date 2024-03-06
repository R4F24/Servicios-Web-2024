from flask import Flask
from flask_cqlalchemy import CQLAlchemy
from flask_cors import CORS

import time
import uuid
import datetime

from kasa import SmartPlug
import subprocess
import json

app = Flask(__name__)
CORS(app)
app.config['CASSANDRA_HOSTS'] = ['127.0.0.1']
app.config['CASSANDRA_KEYSPACE'] = "energy_meter"
db = CQLAlchemy(app)

#dev = SmartPlug("192.168.1.74")
#usage = dev.modules["emeter"]

class emeterdata(db.Model):
    id = db.columns.UUID(primary_key=True, default=uuid.uuid4)
    time_inserted = db.columns.DateTime()
    err_code = db.columns.Boolean()
    current_ma = db.columns.Integer()
    power_mw = db.columns.Integer()
    voltage_mv = db.columns.Integer()
    total_wh = db.columns.Integer()

@app.route('/')
def index():
    return 'Hello!'

@app.route('/energy')

def get_energy():
    # Se hace porque la API no provisiona datos JSON
    # Mientras que la interfaz de CLI si por alguna razon

    # Correr el comando y capturar el output
    output = subprocess.check_output(['kasa', '--host', '192.168.1.64', '--json', 'emeter'])

    # Decodificar el byte string a un string regular
    output_str = output.decode('utf-8')
    json_energy = json.loads(output_str)
    return json_energy

db.sync_db()
currentDatetime = datetime.datetime.now()
user1 = emeterdata.create(current_ma=int(get_energy()['current_ma']),power_mw=int(get_energy()['power_mw'])
                          ,voltage_mv = int(get_energy()['voltage_mv']),total_wh=int(get_energy()['total_wh']),
                          err_code=int(get_energy()['err_code']),time_inserted=currentDatetime)
