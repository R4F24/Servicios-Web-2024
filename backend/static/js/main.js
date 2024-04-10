const ctx1 = document.getElementById('grafica1').getContext('2d');
const ctx2 = document.getElementById('grafica2').getContext('2d');
let backendIp1 = "http://127.0.0.1:5000/getdt";
let backendIp2 = "http://127.0.0.1:5000/getdt";



function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
}
  
function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
}

let updateCount = 0;

function updateGraph1() {
    fetch(backendIp1)
        .then(response => response.json())
        .then(data => {
            let powerByDay = {};

            data.forEach(entry => {
                const date = entry.time_inserted.slice(0, 10);
                if (!powerByDay[date]) {
                    powerByDay[date] = 0;
                }

                powerByDay[date] += entry.power_mw;

            });

            const sortedPowerByDay = Object.keys(powerByDay).map(date => ({
                date,
                power: powerByDay[date]
            }));

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
                        duration: (updateCount > 0) ? 0 : 1000 // Si es la segunda actualización, desactiva la animación
                    },
                    responsive: false
                }
            };

            updateCount++;
            
            if (window.myChart1 instanceof Chart) {
                window.myChart1.destroy();
            }

            window.myChart1 = new Chart(ctx1, config);
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}

let updateCount2 = 0;

function updateGraph2() {
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
                        duration: (updateCount2 > 0) ? 0 : 1000 // Si es la segunda actualización, desactiva la animación
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


updateGraph1();
updateGraph2();
setInterval(updateGraph1, 5000); // Actualiza el primer gráfico cada 5 segundos
setInterval(updateGraph2, 5000); // Actualiza el segundo gráfico cada 5 segundos
