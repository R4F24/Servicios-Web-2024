import asyncio
import subprocess
from flask import Blueprint, redirect, request, jsonify
import json
from kasa import Discover

from Backend_Flask.backend.app import emeterdata
from .device import DeviceDatabaseManager, SmartDevice 

device_routes = Blueprint('device_routes', __name__)



async def get_devices_data():
        devices = await Discover.discover(
            discovery_timeout=2
        )
        device_data = []
        for ip, device in devices.items():
            await device.update()
            device_data.append((ip, device.alias, device.model))
        return device_data

@device_routes.route('/device/connected-devices', methods = ['GET'])
def get_connected_devices():
    result = asyncio.run(get_devices_data())
    return jsonify(result)

@device_routes.route('/device/alias/<alias>', methods=['POST','GET'])
def set_device_alias(alias):
    host = request.args.get('host', default = "", type = str)
    if host:
        device = SmartDevice(host)
        device.set_alias(alias)
        return jsonify({'message': 'SmartDevice alias updated successfully'})
    else:
        return jsonify({'message': 'SmartDevice alias update failed'})

@device_routes.route('/device/alias', methods=['GET'])
def get_device_alias():
    host = request.args.get('host', default = "", type = str)
    if host:
        device = SmartDevice(host)
        alias = device.get_alias()
        return jsonify({'alias': alias})
    else:
        return jsonify({'message': 'Failed to get device alias'})

@device_routes.route('/device/turn-device/<device_name>', methods=['POST','GET'])
async def turn_device(device_name):
    dev = SmartDevice(device_name)
    is_on = dev.toggle()
    if not is_on:
        await dev.get_toggle_state()
        return jsonify({'message': 'Device turned on'})
    else:
        await dev.get_toggle_state()
        return jsonify({'message': 'Device turned off'})

# Redirects to return all the energy metrics in the DB
@device_routes.route('/')
def index():
    return redirect('/energy-management/energy-data-all/')

# Returns JSON of energy metrics in this instant
@device_routes.route('/energy_metrics_now')
def get_energy_metrics():
    #output = subprocess.check_output(['kasa', '--host', '192.168.0.1', '--json', 'emeter'])
    output = subprocess.check_output(['kasa', '--host', '192.168.1.64', '--json', 'emeter'])
    output_str = output.decode('utf-8')
    json_energy = json.loads(output_str)
    return json_energy

# Returns all the energy metrics in the DB
@device_routes.route('/energy-management/energy-data-all/')
def get_all_energy_data():
    results = DeviceDatabaseManager(emeterdata)
    return jsonify(results.get_all_data())

# Returns ALL registries from the DB for a given device
@device_routes.route('/energy-management/energy-data-all/<device_id>')
def get_device_energy_data(device_id):
    if device_id is None:
        return redirect('/energy-management/energy-data-all/')
    else:
        results = DeviceDatabaseManager(emeterdata)
        return jsonify(results.get_all_data(device_id))

@device_routes.route('/api/set_device_name', methods=['POST'])
def set_device_name():
    if request.method == 'POST':
        data = request.get_json()
        device_name = data.get('deviceName')
        print(device_name)
        print('Device name updated successfully', device_name)
        return jsonify({'message': 'Device name updated successfully'})
    else:
        return jsonify({'error': 'Invalid request method'})