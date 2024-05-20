import asyncio
import datetime
import json
import logging
import subprocess
import threading
import time
import uuid
from cassandra import cluster
from flask import Flask, jsonify, redirect, request
from flask_cors import CORS
from flask_cqlalchemy import CQLAlchemy
from kasa import Credentials, Discover, SmartPlug
from .device import SmartDevice, DeviceDatabaseManager

app = Flask(__name__)
CORS(app)

app.config['CASSANDRA_HOSTS'] = ['127.0.0.1']
app.config['CASSANDRA_KEYSPACE'] = "energy_meter"

db = CQLAlchemy(app)

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

async def get_device_data():
    p = SmartPlug("192.168.1.64")
    await p.update()  
    return p.alias, p.mac, p.model

#Insert the data every 15 minutes
def insert_data_periodically(mac_address):
    while True: 
    #for device in devices:
        try:
            if(mac_address):
                currentDatetime = datetime.datetime.now()
                table = emeterdata.create(current_ma=int(get_energy_metrics()['current_ma']),
                                          power_mw=int(get_energy_metrics()['power_mw']),
                                          voltage_mv=int(get_energy_metrics()['voltage_mv']),
                                          total_wh=int(get_energy_metrics()['total_wh']),
                                          err_code=int(get_energy_metrics()['err_code']),
                                          dispositivo=mac_address,
                                          time_inserted=currentDatetime)
                print('este esta dentro del insert prior :', mac_address)
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
                time.sleep(60*15)  # Wait 15 minutes before the next insertion
                print("Data inserted successfully")
        except Exception as e:
            print("Error inserting data: ", e)
            time.sleep(60) # Wait 1 minute before retrying

db.sync_db()
print('Listening on port ', 5000)

loop = asyncio.get_event_loop()
myFun = loop.run_until_complete(get_device_data())

thread = threading.Thread(target=insert_data_periodically, args=(myFun[1],))
  # Asegúrate de establecer el hilo actual al inicio
thread.start()

#app.run(debug=True,host='0.0.0.0')
#app.run(debug=True)  # Ejecuta la aplicación Flask