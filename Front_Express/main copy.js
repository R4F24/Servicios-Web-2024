function main() {
    let backend_ip = "http://127.0.0.1:5000/";
    let updateCount = 0;
    let updateCount2 = 0;
    const ctx1 = document.getElementById('grafica1').getContext('2d');
    const ctx2 = document.getElementById('grafica2').getContext('2d');
    const botonAgregar = document.getElementById('agregarDispositivo');
    let upda = true;

    updateGraph1(backend_ip, updateCount, ctx1); // Llama a las funciones una vez antes de setInterval para evitar duplicar código
    updateGraph2(backend_ip, updateCount2, ctx2);

    setInterval(() => {
        updateGraph1(backend_ip, updateCount, ctx1); // Envuelve cada llamada en una función anónima
        updateCount++;
    }, 5000);
    if(upda==true){
        setInterval(() => {
            updateGraph2(backend_ip, updateCount2, ctx2);
            updateCount2++;
        }, 5000);
        upda=false;
    }

        
    botonAgregar.addEventListener("click",agregarDispositivo); 
}

function updateGraphFromSelectedMonth() {
    const selectedMonth = parseInt(document.getElementById("meses").value);
    updateGraph(backend_ip, updateCount, ctx1, selectedMonth);
}

function updateGraph(backend_ip, updateCount, ctx, selectedMonth) {
    fetch(backend_ip)
        .then(response => response.json())
        .then(data => {
            let powerByTime = {};

            data.forEach(entry => {
                let time;
                if (selectedMonth) {
                    time = entry.time_inserted.slice(0, 7);
                } else {
                    time = entry.time_inserted.slice(0, 10);
                }

                if (!powerByTime[time]) {
                    powerByTime[time] = 0;
                }

                powerByTime[time] += entry.power_mw;
            });

            const sortedPowerByTime = Object.keys(powerByTime).map(time => ({
                time,
                power: powerByTime[time]
            }));

            const labels = sortedPowerByTime.map(entry => entry.time);
            const powerData = sortedPowerByTime.map(entry => entry.power);

            const chartData = {
                labels: labels,
                datasets: [{
                    label: selectedMonth ? 'Energía por mes (mili-watts)' : 'Energía por día (mili-watts)',
                    backgroundColor: selectedMonth ? 'rgba(255, 99, 132, 0.6)' : 'rgb(203, 155, 222)',
                    borderColor: selectedMonth ? 'rgba(255, 99, 132, 1)' : 'rgb(144, 50, 187)',
                    borderWidth: 1,
                    data: powerData
                }]
            };

            const config = {
                type: 'bar',
                data: chartData,
                options: {
                    animation: {
                        duration: 0//(updateCount > 0) ? 0 : 1000 // Si es la segunda actualización, desactiva la animación
                    },
                    responsive: false
                }
            };

            if (window.myChart instanceof Chart) {
                window.myChart.destroy();
            }

            window.myChart = new Chart(ctx, config);
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}

function agregarDispositivo() {
    const contenedorDispositivo = document.createElement('div');
    contenedorDispositivo.classList.add('device');

    const tituloDispositivo = document.createElement('h2');
    tituloDispositivo.textContent = 'Nuevo Dispositivo';

    const infoDispositivo = document.createElement('p');
    infoDispositivo.textContent = 'Información sobre el nuevo dispositivo';

    const canvasGrafica = document.createElement('canvas');
    canvasGrafica.classList.add('grafica');

    contenedorDispositivo.appendChild(tituloDispositivo);
    contenedorDispositivo.appendChild(infoDispositivo);
    contenedorDispositivo.appendChild(canvasGrafica);

    document.querySelector('.dispositivos').appendChild(contenedorDispositivo);

    const ctx = canvasGrafica.getContext('2d');
    updateGraph(backend_ip, updateCount, ctx);
}

document.addEventListener('DOMContentLoaded', function() {
    main();
});

function updateGraphFromSelectedMonth() {
    const selectedMonth = parseInt(document.getElementById("meses").value);
    updateGraph2(backend_ip, updateCount2, ctx2, selectedMonth);
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