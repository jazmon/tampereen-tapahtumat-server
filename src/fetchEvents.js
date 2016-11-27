const moment = require('moment');
// const fetch = require('node-fetch');
require('isomorphic-fetch');

const apiLocale = 'en';
const API_URL_BASE = 'http://visittampere.fi/api/search?type=event';


const start = (num = 0) =>
  moment().add(num, 'days').startOf('day').valueOf();
const end = (num = 6) =>
  moment().add(num, 'days').endOf('day').valueOf();

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}

function multiplySingleDateEvents(events) {
  const singleDateEvents = [];

  events.forEach((event) => {
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
  return singleDateEvents;
}

const getUrl = ({ startDate, endDate }
   = { startDate: start, endDate: end }) =>
    `${API_URL_BASE}&limit=20&start_datetime=${startDate()}&end_datetime=${endDate()}&lang=${apiLocale}`;


const fetchEvents = () => new Promise((resolve, reject) => {
  fetch(getUrl())
  .then(checkStatus)
  .then(parseJSON)
  .then(data => {
    resolve(data);
  })
  .catch(err => {
    reject(err);
  });
});

module.exports = {
  fetchEvents,
  parseJSON,
  checkStatus,
  multiplySingleDateEvents,
};
