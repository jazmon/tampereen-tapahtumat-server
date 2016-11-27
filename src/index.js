// const express = require('express');
import express from 'express';

const moment = require('moment');
const fetch = require('node-fetch');
const morgan = require('morgan');
const helmet = require('helmet');

// const { baseApiUrl } = require('./config');
const fetchEvents = require('./fetchEvents');

const app = express();

app.use(morgan('combined'));
app.use(helmet());


app.get('/', (req, res) => {
  fetchEvents()
    .then(events => res.json(events))
    .catch(err => res.status(500).send('error', JSON.stringify(err)));
});


app.listen(3000, () => console.log('listening on port 3000'));
