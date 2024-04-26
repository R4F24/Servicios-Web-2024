import asyncio
from flask import Flask, jsonify
from flask_cqlalchemy import CQLAlchemy
from flask_cors import CORS
import time
import uuid
import datetime
from kasa import SmartPlug
import subprocess
import json
import threading

import subprocess
import time
from flask import redirect

app = Flask(__name__)
CORS(app)

app.config['CASSANDRA_HOSTS'] = ['127.0.0.1']
#app.config['CASSANDRA_HOSTS'] = ['172.17.0.2']
app.config['CASSANDRA_KEYSPACE'] = "energy_meter"


db = CQLAlchemy(app)

#Definition of the database model
class emeterdata(db.Model):
    id = db.columns.UUID(primary_key=True, default=uuid.uuid4)
    time_inserted = db.columns.DateTime()
    err_code = db.columns.Boolean()
    current_ma = db.columns.Integer()
    power_mw = db.columns.Integer()
    voltage_mv = db.columns.Integer()
    total_wh = db.columns.Integer()
    dispositivo = db.columns.Text()

# Redirects to return all the energy metrics in the DB
@app.route('/')
def index():
    return redirect('/energy-management/energy-data-all/')

# Returns JSON of energy metrics in this instant
@app.route('/energy_metrics_now')
def get_energy_metrics():
    #output = subprocess.check_output(['kasa', '--host', '192.168.0.1', '--json', 'emeter'])
    output = subprocess.check_output(['kasa', '--host', '192.168.1.64', '--json', 'emeter'])
    output_str = output.decode('utf-8')
    json_energy = json.loads(output_str)
    return json_energy

# Returns all the energy metrics in the DB
@app.route('/energy-management/energy-data-all/')
def get_all_energy_data():
    results = emeterdata.filter(emeterdata.err_code == False).allow_filtering()
    data = []
    for result in results:
        data.append({
            'id': result.id,
            'current_ma': result.current_ma,
            'err_code': result.err_code,
            'power_mw': result.power_mw,
            'time_inserted': str(result.time_inserted),
            'total_wh': result.total_wh,
            'voltage_mv': result.voltage_mv,
            'dispositivo': result.dispositivo
        })
    return jsonify(data)

# Returns ALL registries from the DB for a given device
@app.route('/energy-management/energy-data-all/<device_id>')
def get_device_energy_data(device_id):
    if device_id is None:
        return redirect('/energy-management/energy-data-all/')
    else:
        print("Device ID: ", device_id)
        results = emeterdata.filter(emeterdata.dispositivo == device_id).allow_filtering().all()
        data = []
        for result in results:
            data.append({
                'id': result.id,
                'current_ma': result.current_ma,
                'err_code': result.err_code,
                'power_mw': result.power_mw,
                'time_inserted': str(result.time_inserted),
                'total_wh': result.total_wh,
                'voltage_mv': result.voltage_mv,
                'dispositivo': result.dispositivo
            })
        return jsonify(data)

#Insert the data every 15 minutes
def insert_data_periodically():
    while True:
        try:
            currentDatetime = datetime.datetime.now()
            table = emeterdata.create(current_ma=int(get_energy_metrics()['current_ma']),
                                      power_mw=int(get_energy_metrics()['power_mw']),
                                      voltage_mv=int(get_energy_metrics()['voltage_mv']),
                                      total_wh=int(get_energy_metrics()['total_wh']),
                                      err_code=int(get_energy_metrics()['err_code']),
                                      dispositivo='TP-Link Plug',
                                      time_inserted=currentDatetime)
            time.sleep(5)  # Wait 15 minutes before the next insertion
            print("Data inserted successfully")
        except Exception as e:
            print("Error inserting data: ", e)
            time.sleep(60) # Wait 1 minute before retrying

db.sync_db()
print('Listening on port ', 5000)
threading.Thread(target=insert_data_periodically()).start()  # Inicia el hilo para la inserción periódica
#app.run(debug=True,host='0.0.0.0')
#app.run(debug=True)  # Ejecuta la aplicación Flask
