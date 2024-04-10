from flask import Flask, jsonify, render_template
from flask_cqlalchemy import CQLAlchemy
from flask_cors import CORS
import time
import uuid
import datetime
#from kasa import SmartPlug
import subprocess
import json
import threading

app = Flask(__name__,template_folder='plug_graphs')
CORS(app)
#app.config['CASSANDRA_HOSTS'] = ['127.0.0.1']
app.config['CASSANDRA_HOSTS'] = ['172.17.0.2']
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

#Hello!
@app.route('/')
def index():
    return render_template('index.html')

#Returns json of energy metrics in this instant
@app.route('/energy')
def get_energy():
    #output = subprocess.check_output(['kasa', '--host', '192.168.0.1', '--json', 'emeter'])
    output = subprocess.check_output(['kasa', '--host', '192.168.1.64', '--json', 'emeter'])
    output_str = output.decode('utf-8')
    json_energy = json.loads(output_str)
    return json_energy

#Returns ALL registries from the DB
@app.route('/getdt')
def get_data():
    results = emeterdata.filter(emeterdata.err_code == False).allow_filtering().all()
    data = []
    for result in results:
        data.append({
            'id': result.id,
            'current_ma': result.current_ma,
            'err_code': result.err_code,
            'power_mw': result.power_mw,
            'time_inserted': str(result.time_inserted),
            'total_wh': result.total_wh,
            'voltage_mv': result.voltage_mv
        })
    return jsonify(data)

#Inserta los datos cada 5 segundos
def insert_data_periodically():
    while True:
        currentDatetime = datetime.datetime.now()
        table = emeterdata.create(current_ma=int(get_energy()['current_ma']),
                                  power_mw=int(get_energy()['power_mw']),
                                  voltage_mv=int(get_energy()['voltage_mv']),
                                  total_wh=int(get_energy()['total_wh']),
                                  err_code=int(get_energy()['err_code']),
                                  time_inserted=currentDatetime)
        print("hola")
        time.sleep(1)  # Espera 15 minutos antes de la próxima inserción

db.sync_db()
print("hola2")
#print('Listening on port', app.config['SERVER_PORT'])
#threading.Thread(target=insert_data_periodically).start()  # Inicia el hilo para la inserción periódica
#app.run(debug=True,host='0.0.0.0')
#app.run(debug=True)  # Ejecuta la aplicación Flask
