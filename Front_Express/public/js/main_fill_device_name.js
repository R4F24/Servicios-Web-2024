//Pos si no?
window.addEventListener('load', async function() {
    const name = document.getElementById('dev-name');
    const desc = document.getElementById('dev-desc');
    const dev_tmp = await getDevices();
    name.textContent = dev_tmp[0][1];
    desc.textContent = "Modelo: "+dev_tmp[0][2];
});