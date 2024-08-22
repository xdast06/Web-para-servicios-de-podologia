const express = require('express');
const path = require('path');
const Router = express.Router();
const controller = require('../controllers/site.controller');

// Rutas web.

Router.get('/save', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'Storage.html'));
});

Router.get('/find', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'Find.html'));
});

Router.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'View.html'));
});

Router.get('/update/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'Update.html'));
});

// Rutas de datos.
Router.get('/getAll', controller.getPatients)

Router.get('/getData/:nombre', controller.findPatient);

Router.get('/getPatient/:id', controller.getPatientData);

Router.post('/postData', controller.createPatient);

Router.put('/putData/:id', controller.updatePatient);

Router.delete('/delData/:id', controller.deletePatient);

// rutas especiales

Router.get('/statistics', controller.stats);

module.exports = Router;