function main() {
    let backendIp1 = "http://127.0.0.1:5000/getdt";
    let backendIp2 = "http://127.0.0.1:5000/getdt";
    let updateCount = 0;
    let updateCount2 = 0;
    const ctx1 = document.getElementById('grafica1').getContext('2d');
    const ctx2 = document.getElementById('grafica2').getContext('2d');
    const botonAgregar = document.getElementById('agregarDispositivo');
    let upda = true; 
    let start, end = new Date(0);
    let month = 0;

    updateGraph1(backendIp1, updateCount, ctx1,start,end); // Llama a las funciones una vez antes de setInterval para evitar duplicar código
    updateGraph2(backendIp2, updateCount2, ctx2);
    
    modularDeviceDescription('.dev-og', 'Dispositivo 1', 'Sala de estar', 'Luz');

    setInterval(() => {

        try {
            [start, end] = getDates();
            console.log("Start date: ", start, "End date: ", end);
        } catch (error) {
            console.error('Error couldnt return the dates:', error);
        }

        updateGraph1(backendIp1, updateCount, ctx1,start,end); // Envuelve cada llamada en una función anónima
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
            updateGraph2(backendIp2, updateCount2, ctx2,month);
            updateCount2++;
        }, 5000);
        upda=false;
    }

       
    botonAgregar.addEventListener("click",agregarDispositivo); 
    botonAgregar.addEventListener("click",agregarDispositivoMain); 
}
function getDates(){
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    return [startDate, endDate];
}

function updateGraph1(backend_ip, updateCount, ctx1, startDate, endDate) {
    fetch(backend_ip)
        .then(response => response.json())
        .then(data => {
            let powerByDay = {};

            data.forEach(entry => {
                const date = entry.time_inserted.slice(0, 10);
                //console.log("Date de for each: ", date);
                if (!powerByDay[date]) {
                    powerByDay[date] = 0;
                }

                powerByDay[date] += entry.power_mw;

            });

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

function updateGraph2(backendIp2,updateCount2,ctx2,year) {
    fetch(backendIp2)
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

function updateGraphFromSelectedMonth() {
    const selectedMonth = parseInt(document.getElementById("meses").value);
    return selectedMonth;
}
// What the hell with this function?
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

function agregarDispositivo() {
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

    document.querySelector('.dispositivos').appendChild(contenedorDispositivo);

    
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


document.addEventListener('DOMContentLoaded', function() {
    main();
  });