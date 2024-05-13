// Example data for options
let backendIp = "http://127.0.0.1:5000/";
let request_type = "/device/connected-devices";
let full_request = backendIp+request_type;

var devices = getDevices().then(function(deviceList) {
    return deviceList.map(function(device) {
        return device[1]+(device[2] ? " - "+device[2] : "");
    });
});

console.log(devices);
// Get the select element
var select = document.getElementById("device_name");
// Loop through the devices array and create an option for each device
devices.then(function(deviceList) {
    deviceList.forEach(function(device) {
        var option = document.createElement("option");
        option.text = device;
        select.add(option);
    });
});