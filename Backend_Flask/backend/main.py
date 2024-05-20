from flask import Flask
from flask_cors import CORS
from flask_cqlalchemy import CQLAlchemy
import uuid
from .device_routes import device_routes  # import the Blueprint
from .device import SmartDevice, DeviceDatabaseManager, EnergyMetricsInserter
from Backend_Flask.backend.app import emeterdata
import threading


class App:
    def __init__(self,db):
        self.db = db
        self.app = Flask(__name__)
        CORS(self.app)

        self.app.config['CASSANDRA_HOSTS'] = ['127.0.0.1']
        self.app.config['CASSANDRA_KEYSPACE'] = "energy_meter"

        self.db = CQLAlchemy(self.app)

        class devices(self.db.Model):
            mac = self.db.columns.Text(primary_key=True)
            localizacion = self.db.columns.Text()
            nombre = self.db.columns.Text()
            modelo = self.db.columns.Text()

        class emeterdata(self.db.Model):
            id = self.db.columns.UUID(primary_key=True, default=uuid.uuid4)
            time_inserted = self.db.columns.DateTime()
            err_code = self.db.columns.Boolean()
            current_ma = self.db.columns.Integer()

        self.app.register_blueprint(device_routes)  # register the Blueprint

if __name__ == "__main__":
    main = App()
    main.app.run(debug=True)