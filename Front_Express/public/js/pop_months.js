window.onload = function() {
    var currentMonth = new Date().getMonth(); // get the current month (0-11)
    document.getElementById('meses').value = currentMonth; // set the value of the select element
}