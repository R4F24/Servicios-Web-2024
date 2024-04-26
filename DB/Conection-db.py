from flask import Flask, jsonify
from flask_cqlalchemy import CQLAlchemy
from flask_cors import CORS


Microservice1 = Flask(__name__)
CORS(Microservice1)
Microservice1.config['CASSANDRA_HOSTS'] = ['127.0.0.2']
Microservice1.config['CASSANDRA_PORT'] = 9043
Microservice1.config['CASSANDRA_KEYSPACE'] = "Uni_dispositivos"
db_Disp = CQLAlchemy(Microservice1)

Microservice2 = Flask(__name__)
CORS(Microservice2)
Microservice2.config['CASSANDRA_HOSTS'] = ['127.0.0.2']
Microservice2.config['CASSANDRA_PORT'] = 9041
Microservice2.config['CASSANDRA_KEYSPACE'] = "kasa_data"
db_his = CQLAlchemy(Microservice1)



class emeterdata_hist(db_his.Model):
    Edificio = db_his.columns.Text()
    Piso = db_his.columns.Integer()
    salon = db_his.columns.Integer()
    ID_Udg = db_his.columns.Integer()
    time_inserted = db_his.columns.DateTime()
    err_code = db_his.columns.Boolean()
    current_ma = db_his.columns.Integer()
    power_mw = db_his.columns.Integer()
    voltage_mv = db_his.columns.Integer()
    total_wh = db_his.columns.Float()
    Consumption_dia = db_his.columns.Float()
    Consumption_month = db_his.columns.Float()

class Disp(db_Disp.Model):
    Edificio = db_Disp.columns.Text()
    Piso = db_Disp.columns.Integer()
    salon = db_Disp.columns.Integer()
    ID_Udg = db_Disp.columns.Integer()
    Desc_disp = db_Disp.columns.Text()
    Disp_marca = db_Disp.columns.Text()
    Disp_mod = db_Disp.columns.Text()
    
    

#Returns ALL registries from the DB
#@Microservice1.route('/getdt')
def get_data_dis():
    results = Disp.filter().allow_filtering().all()
    data = []
    for result in results:
        data.append({
            'Edificio' :result.Edificio, 
            'Piso' : result.Piso,
            'Salon' : result.Salon,
            'ID_udg' : result.ID_udg,
            'Dispositivo' : result.Dispositivo,
            'Marca' : result.Marca,
            'Modelo' :result.Modelo
        })
    return jsonify(data)

def get_data_his():
    results = emeterdata_hist.filter().allow_filtering().all()
    data = []
    for result in results:
        data.append({
            'Edificio' :result.Edificio, 
            'Piso' : result.Piso,
            'Salon' : result.Salon,
            'ID_udg' : result.ID_udg,
            'time_inserted': str(result.tiempo),
            'current_ma': result.Current,
            'voltage_mv': result.Voltage,
            'power_mw': result.Power,
            'total_wh': result.Total_consumption,
            'Consumption_dia':result.Consumption_dia,
            'Consumption_month': result.Consumption_month
            })
        
    return jsonify(data)

db_his.sync_db()
db_Disp.sync_db()
print("test")
