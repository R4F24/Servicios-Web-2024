function main() {
    let backendIp = "http://127.0.0.1:5000/getdt";

    // Importa los datos y define las etiquetas y los datos para la gráfica
    fetch(backendIp)
        .then(response => response.json())
        .then(data => {
            // Ordenar los datos por fecha
            data.sort((a, b) => new Date(a.time_inserted) - new Date(b.time_inserted));
            
            // Obtener las etiquetas y los datos de energía
            const labels = data.map(entry => {
                // Eliminar los milisegundos de la cadena de fecha y hora
                return entry.time_inserted.slice(0, -7);
            });
            const powerData = data.map(entry => entry.power_mw);

            // Define los datos para la gráfica
            const chartData = {
                labels: labels,
                datasets: [{
                    label: 'Energia en dias/ mili-watts',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: powerData,
                }]
            };

            // Configura y dibuja la gráfica
            const config = {
                type: 'bar',
                data: chartData,
            };

            // Renderiza la gráfica en el canvas con el ID 'myChart'
            var myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

            // Llama a la función fillDropdowns para llenar los dropdowns
            fillDropdowns(labels);
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}

function fillDropdowns(labels) {
    const today = new Date(); // Obtener la fecha actual
    const currentMonth = today.getMonth() + 1; // Obtener el mes actual (los meses comienzan desde 0)
    const currentYear = today.getFullYear(); // Obtener el año actual

    const dayDropdown = document.getElementById('dayDropdown');
    const monthDropdown = document.getElementById('monthDropdown');
    const yearDropdown = document.getElementById('yearDropdown');

    // Limpiar dropdowns
    dayDropdown.innerHTML = "";
    monthDropdown.innerHTML = "";
    yearDropdown.innerHTML = "";

    // Llenar el dropdown del año con el año actual
    const yearOption = document.createElement('option');
    yearOption.text = currentYear;
    yearDropdown.add(yearOption);

    // Llenar el dropdown del mes con el mes actual
    const monthOption = document.createElement('option');
    monthOption.text = currentMonth;
    monthDropdown.add(monthOption);

    // Obtener los días únicos del mes actual
    const uniqueDays = [...new Set(labels.filter(label => label.startsWith(`${currentYear}-${currentMonth.toString().padStart(2, '0')}`)).map(label => label.split('T')[0].split('-')[2]))];

    // Llenar el dropdown de día con los días únicos del mes actual
    uniqueDays.forEach(day => {
        const option = document.createElement('option');
        option.text = day;
        dayDropdown.add(option);
    });
}

function updateChartData(selectedDate) {
    const backendIp = `http://127.0.0.1:5000/getdt?date=${selectedDate}`;

    fetch(backendIp)
        .then(response => response.json())
        .then(data => {
            const labels = data.map(entry => entry.time_inserted.slice(0, -7));
            const powerData = data.map(entry => entry.power_mw);

            const chart = Chart.getChart('myChart');
            chart.data.labels = labels;
            chart.data.datasets[0].data = powerData;
            chart.update();
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    main();
});
