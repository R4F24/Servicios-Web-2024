# Modo de replicacion y clase tentativas a usar, estos parametros estan sujetos a cambios conforme la base de datos crezca

CREATE KEYSPACE IF NOT EXISTS energy_meter WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

    use energy_meter;

    CREATE TABLE emeterdata (
    id UUID PRIMARY KEY,
    time_inserted TIMESTAMP,
    err_code BOOLEAN,
    current_ma INT,
    power_mw INT,
    voltage_mv INT,
    total_wh INT,
    dispositivo TEXT
    );
    
    COPY energy_meter.emeterdata FROM './docker-entrypoint-initdb.d/datos.csv' WITH HEADER = true;
