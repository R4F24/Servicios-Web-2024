let backendIp = "http://127.0.0.1:5000/energy"

async function getEnergyData(){
    fetch(backendIp).then((response) =>{return response.json().then((data) =>{console.log(data)})});
}