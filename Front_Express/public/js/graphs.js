////////////////
// Graficas   //
////////////////

// Queda en WIP
class graph {
    properties = {
        name: "",
        container: "",
        type: "",
        request_type: "",
        options: ""
    }

    constructor(name, container, type, request_type, options) {
        this.name = name;
        this.container = container;
        this.type = type;
        this.request_type = request_type;
        this.options = options;
    }

    initializeGraph() {
        data = fetchGraphData(backend_ip, request_type, id_defaut);
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
    }

    fetchGraphData(backend_ip, request_type, id_defaut="") {

        let full_direction = backend_ip+request_type+id_defaut;
        fetch(full_direction)
            .then(response => response.json());
            
    }

    updateGraph() {
        //Fetch the response and graph it *Needs some fixing*
    }
    //function UpdateGraph(backend_ip, updateCount, container, request_type, id_defaut=""){
    //
    //}
}