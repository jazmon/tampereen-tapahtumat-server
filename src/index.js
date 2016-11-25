const express = require('express');
const moment = require('moment');
const fetch = require('node-fetch');
const morgan = require('morgan');
const helmet = require('helmet');

// const { baseApiUrl } = require('./config');

const app = express();

app.use(morgan('combined'));
app.use(helmet());

const apiLocale = 'en';
const API_URL_BASE = 'http://visittampere.fi/api/search?type=event';


export const start = (num = 0) =>
  moment().add(num, 'days').startOf('day').valueOf();
export const end = (num = 6) =>
  moment().add(num, 'days').endOf('day').valueOf();

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export function parseJSON(response) {
  return response.json();
}

export function multiplySingleDateEvents(events) {
  const singleDateEvents = [];

  events.forEach(event => {
    if (event.single_datetime) {
      singleDateEvents.push(event);
    } else {
      event.times.forEach((time, index) => {
        singleDateEvents.push(Object.assign({}, event, {
          item_id: event.item_id + index * 100000,
          start_datetime: time.start_datetime,
          end_datetime: time.end_datetime,
        }));
      });
    }
  });
}

export const getUrl = ({ startDate, endDate }
   = { startDate: start, endDate: end }) =>
    `${API_URL_BASE}&limit=20&start_datetime=${startDate()}&end_datetime=${endDate()}&lang=${apiLocale}`;

app.get('/', (req, res) => {
  fetch(getUrl())
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      return res.json(data);
    })
    .catch(err => {
      return res.status(500).send('error', JSON.stringify(err));
    });
});


app.listen(3000, () => console.log('listening on port 3000'));
