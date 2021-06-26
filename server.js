const bodyparser = require('body-parser');
const express = require('express');

const route = require('./router/student.router')();

let app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.use('/v1/controlescolar', route);

module.exports = app;