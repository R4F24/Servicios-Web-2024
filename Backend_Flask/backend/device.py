import subprocess
import json
from kasa import SmartPlug
from flask_cqlalchemy import CQLAlchemy
import datetime
import time

class SmartDevice:
    """
    Esta es la clase SmartDevice.
    """
    def __init__(self, host):
        """
        Inicializa la clase SmartDevice,
        es un wrapper para la clase SmartPlug(Por el momento)

        Args:
            host (str): Puede ser una direccion ip o nombre de dispositivo
        """
        self.device = SmartPlug(host)

    async def update(self):
        await self.device.update()

    async def set_alias(self, alias):
        await self.update()
        await self.device.set_alias(alias)
    
    async def get_alias(self):
        await self.update()
        return await self.device.alias

    async def toggle(self):
        await self.update()
        if not self.device.is_on:
            await self.device.turn_on()
            return True #Turned on
        else:
            await self.device.turn_off()
            return False #Turned off
        
    async def get_toggle_state(self):
        await self.update()
        if not self.device.is_on:
            return False #Turned on
        else:
            return True #Turned off
        
class DeviceDatabaseManager:
    def __init__(self, db_model):
        self.db_model = db_model

    def insert_data(self, data):
        try:
            self.db_model.create(**data)
            print("Data inserted successfully")
        except Exception as e:
            print("Error inserting data: ", e)

    def get_all_data(self):
        results = self.db_model.filter(self.db_model.err_code == False).allow_filtering()
        data = [self._result_to_dict(result) for result in results]
        return data

    def get_data_by_device(self, device_id):
        results = self.db_model.filter(self.db_model.dispositivo == device_id).allow_filtering().all()
        data = [self._result_to_dict(result) for result in results]
        return data

    def _result_to_dict(self, result):
        return {
            'id': result.id,
            'current_ma': result.current_ma,
            'err_code': result.err_code,
            'power_mw': result.power_mw,
            'time_inserted': str(result.time_inserted),
            'total_wh': result.total_wh,
            'voltage_mv': result.voltage_mv,
            'dispositivo': result.dispositivo
        }
def get_energy_metrics():
    #output = subprocess.check_output(['kasa', '--host', '192.168.0.1', '--json', 'emeter'])
    output = subprocess.check_output(['kasa', '--host', '192.168.1.64', '--json', 'emeter'])
    output_str = output.decode('utf-8')
    json_energy = json.loads(output_str)
    return json_energy

class EnergyMetricsInserter:
    def __init__(self, table, mac_address=None):
        self.table = table
        self.mac_address = mac_address

    def insert_data(self, sleep_time):
        try:
            data = get_energy_metrics()
            currentDatetime = datetime.datetime.now()
            self.table.create(current_ma=int(get_energy_metrics()['current_ma']),
                              power_mw=int(get_energy_metrics()['power_mw']),
                              voltage_mv=int(get_energy_metrics()['voltage_mv']),
                              total_wh=int(get_energy_metrics()['total_wh']),
                              err_code=int(get_energy_metrics()['err_code']),
                              dispositivo=self.mac_address,
                              time_inserted=currentDatetime)
            print(f"Data inserted successfully for device: {self.mac_address}")
            time.sleep(sleep_time)
        except Exception as e:
            print("Error inserting data: ", e)
            time.sleep(60)  # Wait 1 minute before retrying