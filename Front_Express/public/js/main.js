function main() {
    let backendIp = "http://127.0.0.1:5000/";
    // Update count for the graphs animation
    // WILL BE SCRAPPED
    let updateCount = 0;
    let updateCount2 = 0;

    const ctx1 = document.getElementById('grafica1').getContext('2d');
    const ctx2 = document.getElementById('grafica2').getContext('2d');
    //const ctx3 = document.getElementById('grafica3').getContext('2d');
    const botonAgregar = document.getElementById('agregarDispositivo');
    // Get the reload button
    const btn_refresh = document.getElementById("btn-refresh");
    const btn_filter = document.getElementById("btn-filter");
    let upda = true; 
    let start, end = new Date(0);
    let month = 0;
    
    let device_id = "";
    
    // Llama a las funciones una vez antes de setInterval para evitar duplicar código
    updateGraph1(backendIp, updateCount, ctx1,start,end); 
    updateGraph2(backendIp, updateCount2, ctx2);
    //updateGraph3(backendIp, updateCount, ctx3,start,end); 
    // modularDeviceDescription('.dev-og', 'Dispositivo 1', 'Sala de estar', '-Lampara');

    setInterval(() => {
        try {
            [start, end] = getDates();
            console.log("Start date: ", start, "End date: ", end);
        } catch (error) {
            console.error('Error couldnt return the dates:', error);
        }

        updateGraph1(backendIp, updateCount, ctx1,start,end,device_id);
        //updateGraph3(backendIp, ctx3,start,end, device_id); 
        updateCount++;
    }, 5000);
    
    if(upda==true){

        setInterval(() => {
            try {
                month = updateGraphFromSelectedMonth();
                console.log("Month: ", month=month+1);
            } catch (error) {
                console.error('Error couldnt return the year:', error);
            }
            updateGraph2(backendIp, updateCount2, ctx2, month);
            updateCount2++;
        }, 5000);
        upda=false;
    }
       
    botonAgregar.addEventListener("click",agregarDispositivo); 
    //btn_refresh.addEventListener("click",SetDeviceInsertName); 
    btn_filter.addEventListener("click", async () => {
        device_id = await GetSelectedDevice();
    });
}

//@app.route('/device/alias/<alias>', methods=['POST','GET'])
async function setDeviceAlias(alias) {
    // Your code here
    const backendIp = "http://127.0.0.1:5000";
    const endpoint = "/device/alias/" + alias;
    const url = backendIp + endpoint;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });

    const data = await response.json();
    return data;
}



async function turnDevice() {
    const backendIp = "http://127.0.0.1:5000";
    const endpoint = "/device/turn-device";
    const url = backendIp + endpoint;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ })
    });

    const data = await response.json();
    return data;
}

/*Update Device*/

// When the user clicks the button, refresh the selected device
async function GetSelectedDevice() {
    const selected_device = document.getElementById("device_name").value;
    return selected_device;
}

function SetDeviceInsertName(){
    let backendIp = "http://127.0.0.1:5000/";
    const selected_device = document.getElementById("device_name").value;
    fetch(backendIp+'/api/set_device_name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deviceName: selected_device })
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the Flask app
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Get the selected Month 
// to filter the power usage
function updateGraphFromSelectedMonth() {
    const selectedMonth = parseInt(document.getElementById("meses").value);
    return selectedMonth;
}


// Get the start and end dates
function getDates(){
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    return [startDate, endDate];
}

async function getDevices() {
    try {
        const response = await fetch(full_request);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
}


// Graph filtering power usage by day
function updateGraph1(backend_ip, updateCount, ctx1, startDate, endDate,) {
    //Request stuff
    let request_type = '/energy-management/energy-data-all/';
    //Full ip
    let full_direction = backend_ip+request_type;

    //Fetch the response and graph it *Needs some fixing*
    fetch(full_direction)
        .then(response => response.json())
        .then(data => {
            //Array of power consumed by day
            let powerByDay = {};

            data.forEach(entry => {
                //Slice the date to delete the seconds
                const date = entry.time_inserted.slice(0, 10);
                //console.log("Date de for each: ", date);
                //If the value doesnt exist it's == '0'
                if (!powerByDay[date]) {
                    powerByDay[date] = 0;
                }
                //Else sum the mili-watts
                powerByDay[date] += entry.power_mw;

            });
            // If the fields of start and end
            // are populated the filter the dates*
            if (startDate && endDate) {
                const filteredPowerByDay = {};
                Object.keys(powerByDay).forEach(date => {
                    if (date >= startDate && date <= endDate) {
                        filteredPowerByDay[date] = powerByDay[date];
                    }
                });
                powerByDay = filteredPowerByDay;
                console.log("Power by day: ", powerByDay);
            }

            const sortedPowerByDay = Object.keys(powerByDay)
                .map(date => ({
                    date,
                    power: powerByDay[date]
                }))
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            const labels = sortedPowerByDay.map(entry => entry.date);
            const powerData = sortedPowerByDay.map(entry => entry.power);

            const chartData = {
                labels: labels,
                datasets: [{
                    label: 'Energía por día (mili-watts)',
                    backgroundColor: 'rgb(203, 155, 222)',
                    borderColor: 'rgb(144, 50, 187)',
                    borderWidth: 1,
                    data: powerData
                }]
            };

            const config = {
                type: 'bar',
                data: chartData,
                options: {
                    animation: {
                        duration: 0 //(updateCount > 0) ? 0 : 1000 // Si es la segunda actualización, desactiva la animación
                    },
                    responsive: false
                }
            };


            if (window.myChart1 instanceof Chart) {
                window.myChart1.destroy();
            }

            window.myChart1 = new Chart(ctx1, config);
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}

// Graph filtering power usage by moth
// IT ISN'T BY YEAR, IT'S BY MONTH
function updateGraph2(backendIp,updateCount2,ctx2,year="") {
    fetch(backendIp)
        .then(response => response.json())
        .then(data => {
            let powerByMonth = {}; // Cambiamos powerByDay a powerByMonth

            data.forEach(entry => {
                const date = entry.time_inserted.slice(0, 7); // Tomamos solo el año y mes (primeros 7 caracteres)
                if (!powerByMonth[date]) {
                    powerByMonth[date] = 0;
                }
                powerByMonth[date] += entry.power_mw;

            });

            if (year != null){
                powerByMonth = Object.keys(powerByMonth)
                    .filter(date => date.includes(year))
                    .reduce((obj, date) => {
                        obj[date] = powerByMonth[date];
                        return obj;
                    }, {});
            }

            const sortedPowerByMonth = Object.keys(powerByMonth).map(date => ({
                date,
                power: powerByMonth[date]
            }));

            const labels = sortedPowerByMonth.map(entry => entry.date);
            const powerData = sortedPowerByMonth.map(entry => entry.power);

            const chartData = {
                labels: labels,
                datasets: [{
                    label: 'Energía por mes (mili-watts)', // Cambiamos el nombre del label
                    backgroundColor: 'rgba(255, 99, 132, 0.6)', 
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    data: powerData
                }]
            };

            const config = {
                type: 'bar',
                data: chartData,
                options: {
                    animation: {
                        duration: 0//(updateCount2 > 0) ? 0 : 1000 // Si es la segunda actualización, desactiva la animación
                    },
                    responsive: false
                }
            };
            updateCount2++;
            if (window.myChart2 instanceof Chart) {
                window.myChart2.destroy();
            }

            window.myChart2 = new Chart(ctx2, config);
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}

function updateGraph3(backend_ip, ctx3, startDate, endDate, id_defaut = "") {
    let request_type = '/energy-management/energy-data-all/';
    let full_direction = backend_ip+request_type+id_defaut;

    fetch(full_direction)
        .then(response => response.json())
        .then(data => {
            let powerByTime = {};

            data.forEach(entry => {
                const time = entry.time_inserted;
                if (!powerByTime[time]) {
                    powerByTime[time] = 0;
                }
                powerByTime[time] += entry.power_mw;
            });

            if (startDate && endDate) {
                const filteredPowerByTime = {};
                Object.keys(powerByTime).forEach(time => {
                    if (time >= startDate && time <= endDate) {
                        filteredPowerByTime[time] = powerByTime[time];
                    }
                });
                powerByTime = filteredPowerByTime;
            }

            const sortedPowerByTime = Object.keys(powerByTime)
                .map(time => ({
                    time,
                    power: powerByTime[time]
                }))
                .sort((a, b) => new Date(a.time) - new Date(b.time));

            const labels = sortedPowerByTime.map(entry => entry.time);
            const powerData = sortedPowerByTime.map(entry => entry.power);

            const chartData = {
                labels: labels,
                datasets: [{
                    label: 'Energía por tiempo (mili-watts)',
                    backgroundColor: 'rgb(203, 155, 222)',
                    borderColor: 'rgb(144, 50, 187)',
                    borderWidth: 1,
                    data: powerData,
                    fill: false,
                    lineTension: 0,
                    pointRadius: 2
                }]
            };

            const config = {
                type: 'line',
                data: chartData,
                options: {
                    animation: {
                        duration: 0
                    },
                    responsive: false
                }
            };

            if (window.myChart3 instanceof Chart) {
                window.myChart3.destroy();
            }

            window.myChart3 = new Chart(ctx3, config);
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}
// Add descriptions of the devices
// in a modular way
function modularDeviceDescription(parentSelector, nombreDispositivo, localizacionDispositivo, tipoDispositivo) {
    const contenedorDispositivo = document.createElement('div');
    contenedorDispositivo.classList.add('device');
    
    const tituloDispositivo = document.createElement('h2');
    tituloDispositivo.textContent = nombreDispositivo;

    const infoDispositivo = document.createElement('p');
    infoDispositivo.textContent = localizacionDispositivo + ' ' + tipoDispositivo;

    contenedorDispositivo.appendChild(tituloDispositivo);
    contenedorDispositivo.appendChild(infoDispositivo);

    document.querySelector(parentSelector).appendChild(contenedorDispositivo);
}
// Add aditional devices to main
// in a modular way
// *NEEDS REWORK*
function AddDeviceModular(parentSelector, nombreDispositivo, localizacionDispositivo, tipoDispositivo) {
    const contenedorDispositivo = document.createElement('div');
    contenedorDispositivo.classList.add('device');
    
    const tituloDispositivo = document.createElement('h2');
    tituloDispositivo.textContent = nombreDispositivo;

    const infoDispositivo = document.createElement('p');
    infoDispositivo.textContent = localizacionDispositivo + ' ' + tipoDispositivo;

    const canvasGrafica1 = document.createElement('canvas');
    canvasGrafica1.id = 'grafica'+nombreDispositivo; 

    const canvasGrafica2 = document.createElement('canvas');
    canvasGrafica2.id = 'grafica2'; 

    contenedorDispositivo.appendChild(tituloDispositivo);
    contenedorDispositivo.appendChild(infoDispositivo);
    contenedorDispositivo.appendChild(canvasGrafica1);
    contenedorDispositivo.appendChild(canvasGrafica2);

    document.querySelector('.charts-dinamic').appendChild(contenedorDispositivo);

    
    const config1 = {
        type: 'bar',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
            datasets: [{
                label: 'Energia en días',
                backgroundColor: 'rgb(203, 155, 222)',
                borderColor: 'rgb(144, 50, 187)',
                borderWidth: 1,
                data: [0, 10, 5, 2, 20, 30], 
            }]
        },
        options: {}
    };

    const config2 = {
        type: 'bar',
        data: {
            labels: ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6'],
            datasets: [{
                label: 'Energia en meses',
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                data: [10, 20, 15, 12, 10, 5], 
            }]
        },
        options: {}
    };

    new Chart(canvasGrafica1, config1);
    new Chart(canvasGrafica2, config2);
}


function agregarDispositivoMain() {
    const contenedorDispositivo = document.createElement('div');
    contenedorDispositivo.classList.add('device');
    
    const tituloDispositivo = document.createElement('h2');
    tituloDispositivo.textContent = 'Nuevo Dispositivo';

    const infoDispositivo = document.createElement('p');
    infoDispositivo.textContent = 'Información sobre el nuevo dispositivo';

    const canvasGrafica1 = document.createElement('canvas');
    canvasGrafica1.id = 'grafica1'; 

    const canvasGrafica2 = document.createElement('canvas');
    canvasGrafica2.id = 'grafica2'; 

    contenedorDispositivo.appendChild(tituloDispositivo);
    contenedorDispositivo.appendChild(infoDispositivo);
    contenedorDispositivo.appendChild(canvasGrafica1);
    contenedorDispositivo.appendChild(canvasGrafica2);

    document.querySelector('.charts-dinamic').appendChild(contenedorDispositivo);

    
    //const config1 = {
    //    type: 'bar',
    //    data: {
    //        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
    //        datasets: [{
    //            label: 'Energia en días',
    //            backgroundColor: 'rgb(203, 155, 222)',
    //            borderColor: 'rgb(144, 50, 187)',
    //            borderWidth: 1,
    //            data: [0, 10, 5, 2, 20, 30], 
    //        }]
    //    },
    //    options: {}
    //};
//
    //const config2 = {
    //    type: 'bar',
    //    data: {
    //        labels: ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6'],
    //        datasets: [{
    //            label: 'Energia en meses',
    //            backgroundColor: 'rgba(255, 99, 132, 0.6)',
    //            borderColor: 'rgba(255, 99, 132, 1)',
    //            borderWidth: 1,
    //            data: [10, 20, 15, 12, 10, 5], 
    //        }]
    //    },
    //    options: {}
    //};
//
    //new Chart(canvasGrafica1, config1);
    //new Chart(canvasGrafica2, config2);
}
// Add aditional devices to main
// in a modular way
// *WILL BE MERGED INTO ONE FUNCTION WITH 'agregarDispositivoMain'*
async function agregarDispositivo() {
    /// FIXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    const contenedorGraph = document.createElement('div');
    contenedorGraph.classList.add('chart-container');
    contenedorGraph.style.display = 'flex';

    const dev_tmp = await getDevices();
    console.log("Devices: ", dev_tmp);

    const contenedorDispositivo = document.createElement('div');
    contenedorDispositivo.classList.add('device');
    contenedorDispositivo.style.display = 'flex';
    contenedorDispositivo.style.flexDirection = 'column'; // Set flex direction to column

    const tituloDispositivo = document.createElement('h2');
    tituloDispositivo.textContent = dev_tmp[0][1];

    const infoDispositivo = document.createElement('p');
    infoDispositivo.textContent = 'Modelo: '+dev_tmp[0][2];

    const canvasGrafica1 = document.createElement('canvas');
    canvasGrafica1.id = 'grafica1'; 
    canvasGrafica1.width = 300;
    canvasGrafica1.height = 300;

    const canvasGrafica2 = document.createElement('canvas');
    canvasGrafica2.id = 'grafica2';
    canvasGrafica2.width = 300;
    canvasGrafica2.height = 300;

    contenedorDispositivo.appendChild(tituloDispositivo);
    contenedorDispositivo.appendChild(infoDispositivo);
    contenedorDispositivo.appendChild(contenedorGraph);
    contenedorGraph.appendChild(canvasGrafica1);
    contenedorGraph.appendChild(canvasGrafica2);

    document.querySelector('.device-add').appendChild(contenedorDispositivo);


        //Request stuff
        let request_type = '/energy-management/energy-data-all/';
        //Full ip
        let full_direction = "http://127.0.0.1:5000/"+request_type;
    
        //Fetch the response and graph it *Needs some fixing*
        fetch(full_direction)
            .then(response => response.json())
            .then(data => {
                let startDate = document.getElementById("startDate").value;
                let endDate = document.getElementById("endDate").value;
                //Array of power consumed by day
                let powerByDay = {};
    
                data.forEach(entry => {
                    //Slice the date to delete the seconds
                    const date = entry.time_inserted.slice(0, 10);
                    //console.log("Date de for each: ", date);
                    //If the value doesnt exist it's == '0'
                    if (!powerByDay[date]) {
                        powerByDay[date] = 0;
                    }
                    //Else sum the mili-watts
                    powerByDay[date] += entry.power_mw;
    
                });
                // If the fields of start and end
                // are populated the filter the dates*
                if (startDate && endDate) {
                    const filteredPowerByDay = {};
                    Object.keys(powerByDay).forEach(date => {
                        if (date >= startDate && date <= endDate) {
                            filteredPowerByDay[date] = powerByDay[date];
                        }
                    });
                    powerByDay = filteredPowerByDay;
                    console.log("Power by day: ", powerByDay);
                }
    
                const sortedPowerByDay = Object.keys(powerByDay)
                    .map(date => ({
                        date,
                        power: powerByDay[date]
                    }))
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
    
                const labels = sortedPowerByDay.map(entry => entry.date);
                const powerData = sortedPowerByDay.map(entry => entry.power);
    
                const chartData = {
                    labels: labels,
                    datasets: [{
                        label: 'Energía por día (mili-watts)',
                        backgroundColor: 'rgb(203, 155, 222)',
                        borderColor: 'rgb(144, 50, 187)',
                        borderWidth: 1,
                        data: powerData
                    }]
                };
    
                const config = {
                    type: 'bar',
                    data: chartData,
                    options: {
                        animation: {
                            duration: 0 //(updateCount > 0) ? 0 : 1000 // Si es la segunda actualización, desactiva la animación
                        },
                        responsive: false
                    }
                };
                new Chart(canvasGrafica1, config);
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
            });

    fetch(backendIp)
    .then(response => response.json())
    .then(data => {
        year = "";
        let powerByMonth = {}; // Cambiamos powerByDay a powerByMonth

        data.forEach(entry => {
            const date = entry.time_inserted.slice(0, 7); // Tomamos solo el año y mes (primeros 7 caracteres)
            if (!powerByMonth[date]) {
                powerByMonth[date] = 0;
            }
            powerByMonth[date] += entry.power_mw;

        });

        if (year != null){
            powerByMonth = Object.keys(powerByMonth)
                .filter(date => date.includes(year))
                .reduce((obj, date) => {
                    obj[date] = powerByMonth[date];
                    return obj;
                }, {});
        }

        const sortedPowerByMonth = Object.keys(powerByMonth).map(date => ({
            date,
            power: powerByMonth[date]
        }));

        const labels = sortedPowerByMonth.map(entry => entry.date);
        const powerData = sortedPowerByMonth.map(entry => entry.power);

        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Energía por mes (mili-watts)', // Cambiamos el nombre del label
                backgroundColor: 'rgba(255, 99, 132, 0.6)', 
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                data: powerData
            }]
        };

        const config = {
            type: 'bar',
            data: chartData,
            options: {
                animation: {
                    duration: 0//(updateCount2 > 0) ? 0 : 1000 // Si es la segunda actualización, desactiva la animación
                },
                responsive: false
            }
        };
        new Chart(canvasGrafica2, config);
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });

    

}

// Once the DOM has finished loadindg start the main
document.addEventListener('DOMContentLoaded', function() {
    main();
  });