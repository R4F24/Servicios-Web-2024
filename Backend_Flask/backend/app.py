import asyncio
from flask import Flask, jsonify, request
from flask_cqlalchemy import CQLAlchemy
from flask_cors import CORS
from kasa import Discover, Credentials
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
#app.config['CASSANDRA_HOSTS'] = ['172.17.0.3']
app.config['CASSANDRA_KEYSPACE'] = "energy_meter"
app.config['CASSANDRA_PORT'] = 9042

db = CQLAlchemy(app)
async def get_device_data():
    p = SmartPlug("192.168.0.1")

    await p.update()  # Request the update
    print(p.alias)  # Print out the alias
    print(p.mac)  # Print out current emeter status
    print(p.model)  # Print out the model
    return p.alias, p.mac, p.model

@app.route('/device/alias/<alias>', methods=['POST','GET'])
async def get_device_alias(alias):
    p = SmartPlug("192.168.0.1")
    await p.update()
    await p.set_alias(alias)
    return jsonify({'message': 'Device alias updated successfully'})

@app.route('/device/turn-device', methods=['POST','GET'])
async def turn_device():
    p = SmartPlug("192.168.0.1")
    await p.update()
    if not p.is_on:
        await p.turn_on()
        return jsonify({'message': 'Device turned on'})
    else:
        await p.turn_off()
        return jsonify({'message': 'Device turned off'})

async def get_devices_data():
        devices = await Discover.discover(
            discovery_timeout=2
        )
        device_data = []
        for ip, device in devices.items():
            await device.update()
            device_data.append((ip, device.alias, device.model))
        return device_data

class devices(db.Model):
    mac = db.columns.Text(primary_key=True)
    localizacion = db.columns.Text()
    nombre = db.columns.Text()
    modelo = db.columns.Text()

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

@app.route('/device/connected-devices')
def get_connected_devices():
    result = asyncio.run(get_devices_data())
    return jsonify(result)

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

nombre_dispositivo = ""
#declare
stop_threads = False
current_thread = None  # Añadido para mantener una referencia al hilo actual

@app.route('/api/set_device_name', methods=['POST'])
def set_device_name():
    global current_thread  # Añadido para poder modificar la variable global
    if request.method == 'POST':
        data = request.get_json()
        global device_name
        device_name = data.get('deviceName')
        global stop_threads
        stop_threads = True  # Detiene el hilo actual
        if current_thread is not None:  # Si hay un hilo actual, espera a que termine
            current_thread.join(timeout=1)  # Espera hasta 1 segundo para que el hilo termine
        stop_threads = False  # Prepara para el nuevo hilo
        print(device_name)
        current_thread = threading.Thread(target=insert_data_periodically, args=(device_name,))  # Actualiza el hilo actual
        current_thread.start()  # Inicia el nuevo hilo
        print('Device name updated successfully', device_name)
        return jsonify({'message': 'Device name updated successfully'})
    else:
        return jsonify({'error': 'Invalid request method'})


#Insert the data every 15 minutes
def insert_data_periodically(nombre_dispositivo):
    global stop_threads
    devices = asyncio.run(get_devices_data())
    while not stop_threads:  # Cambiado a not stop_threads para que el hilo se ejecute hasta que stop_threads sea True
    #for device in devices:
        try:
            if(nombre_dispositivo):
                currentDatetime = datetime.datetime.now()
                table = emeterdata.create(current_ma=int(get_energy_metrics()['current_ma']),
                                          power_mw=int(get_energy_metrics()['power_mw']),
                                          voltage_mv=int(get_energy_metrics()['voltage_mv']),
                                          total_wh=int(get_energy_metrics()['total_wh']),
                                          err_code=int(get_energy_metrics()['err_code']),
                                          dispositivo=nombre_dispositivo,
                                          time_inserted=currentDatetime)
                print('este esta dentro del insert prior :', nombre_dispositivo)
                time.sleep(60*5)  # Wait 15 minutes before the next insertion
                print("Data inserted successfully")
            else:
                currentDatetime = datetime.datetime.now()
                table = emeterdata.create(current_ma=int(get_energy_metrics()['current_ma']),
                                          power_mw=int(get_energy_metrics()['power_mw']),
                                          voltage_mv=int(get_energy_metrics()['voltage_mv']),
                                          total_wh=int(get_energy_metrics()['total_wh']),
                                          err_code=int(get_energy_metrics()['err_code']),
                                          time_inserted=currentDatetime)
                time.sleep(60*5)  # Wait 15 minutes before the next insertion
                print("Data inserted successfully")
        except Exception as e:
            print("Error inserting data: ", e)
            time.sleep(60) # Wait 1 minute before retrying

        if stop_threads:
            break

db.sync_db()
print('Listening on port ', 5000)

thread = threading.Thread(target=insert_data_periodically, args=('TP-Link Plug',))
current_thread = thread  # Asegúrate de establecer el hilo actual al inicio
thread.start()

#app.run(debug=True,host='0.0.0.0')
#app.run(debug=True)  # Ejecuta la aplicación Flask