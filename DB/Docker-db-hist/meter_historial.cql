CREATE KEYSPACE kasa_data WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor' : 1};
USE kasa_data;
CREATE TABLE his_kasa_data (
  Edificio VARCHAR,
  Piso INT,
  Salon INT,
  ID_udg INT,
  tiempo TIMESTAMP,
  Current FLOAT,
  Voltage FLOAT,
  Power FLOAT,
  Total_consumption FLOAT,
  Consumption_dia FLOAT,
  Consumption_month FLOAT,
  PRIMARY KEY ((Edificio, Piso,Salon), ID_udg)
);



