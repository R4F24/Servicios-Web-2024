const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors()); // Esto permitirá todas las solicitudes CORS
app.use(express.static(__dirname + '/public'));

// Ruta de inicio, redirige a la página HTML
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// Iniciar el servidor en el puerto 80
const PORT = 80;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

