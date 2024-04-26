# Modo de replicacion y clase tentativas a usar, estos parametros estan sujetos a cambios conforme la base de datos crezca
CREATE KEYSPACE Uni_dispositivos WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor' : 1};
USE Uni_dispositivos;
CREATE TABLE Dispositivos (
  Edificio VARCHAR,
  Piso INT,
  Salon INT,
  ID_udg INT,
  Dispositivo VARCHAR,
  Marca VARCHAR,
  Modelo VARCHAR,
  PRIMARY KEY ((Edificio, Piso,Salon), ID_udg)
);

INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194590, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194621, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194613, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194920, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194463, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194559, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194519, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194625, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3195031, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194576, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194511, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3193644, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194755, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194610, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194530, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194728, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194944, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194423, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194733, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194567, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194366, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194502, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3194631, 'Computadora', 'DELL', 'OptiPlex 3070');
INSERT INTO Dispositivos (Edificio, Piso, Salon, ID_udg, Dispositivo,Marca,Modelo) VALUES ('C', 1, 07,3195729, 'Computadora', 'DELL', 'OptiPlex 3070');
