
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
