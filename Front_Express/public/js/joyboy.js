const BACKEND_IP = "http://127.0.0.1:5000";
const HEADERS = {
    'Content-Type': 'application/json'
};

class chart(){

};

async function fetchFromBackend(endpoint, method='POST',body={}){
    try {
        const response = await fetch(`${BACKEND_IP}${endpoint}$`, {
            method,
            headers: HEADERS,
            body: JSON.stringify(body)
        });

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function SetDeviceAlias(alias) {
    return fetchFromBackend(`/device/alias/${alias}$`);
}

async function TurnDevice() {
    const endpoint = "/device/turn-device";
    return fetchFromBackend(endpoint,)
}

async function GetSelectedDevice() {
    const selected_device = document.getElementById("device_name").value;
    return selected_device;
}

function SetDeviceInsertName(){
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
function UpdateGraphFromSelectedMonth() {
    const selectedMonth = parseInt(document.getElementById("meses").value);
    return selectedMonth;
}

// Get the start and end dates
function GetDates(){
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    return [startDate, endDate];
}

async function GetDevices() {
    try {
        const response = await fetch(full_request);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
}


function main(){

}

document.addEventListener('DOMContentLoaded', function(){
    main();
});