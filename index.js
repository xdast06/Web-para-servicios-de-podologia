const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const app = express();


// Middleware para analizar JSON
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/podologia", require("./routes/site.routes"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Inicio.html'));
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));