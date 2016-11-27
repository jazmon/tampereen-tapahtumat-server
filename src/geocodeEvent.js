// @flow
require('dotenv').config();

const API_KEY = process.env.GOOGLE_API_KEY;

const googleMapsClient = require('@google/maps').createClient({
  key: API_KEY,
});

export function geocodeAddress(address: string) {
  return new Promise((resolve, reject) => {
    googleMapsClient.geocode({
      address,
    }, (err, response) => {
      if (!err) {
        if (response.json.status !== 'OK') {
          reject(response.json.status);
        } else {
          resolve(response.json.results[0].geometry.location);
        }
      } else {
        reject(err);
      }
    });
  });
}

export function geocodeEvents(events: Array<any>) {

}
export default geocodeEvents;
