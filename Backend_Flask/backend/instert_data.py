from flask import Flask
import threading

from Backend_Flask.backend.device import EnergyMetricsInserter

app = Flask(__name__)
thread = None

def run_inserter(emeterdata, mac_address, db):
    while True:
        if mac_address:
            inserter = EnergyMetricsInserter(emeterdata, mac_address)
            inserter.insert_data(60*15)
        else:
            inserter = EnergyMetricsInserter(emeterdata)
            inserter.insert_data(60*15)
        db.sync_db()
        print('Listening on port ', 5000)

@app.route('/start/<host>')
def start(host):
    global thread
    if thread:
        stop()
        return 'Stopped current thread, starting new one'
    else:
        thread = threading.Thread(target=run_inserter, args=(emeterdata, mac_address, db))
        thread.start()
        return 'Started'

@app.route('/stop/<host>')
def stop(host):
    global thread
    if thread:
        thread.stop()
    return 'Stopped'

if __name__ == '__main__':
    app.run(debug=True)