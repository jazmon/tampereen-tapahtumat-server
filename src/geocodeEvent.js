// @flow

const API_KEY = process.env.GOOGLE_API_KEY;

const googleMapsClient = require('@google/maps').createClient({
  key: API_KEY,
});

export function geocodeAddress(address: ?string) {
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

export function geocodeEvents(events: Array<Event>) {
  return new Promise((resolve, reject) => {
    const promises = events.map((event: Event) =>
      new Promise((res, rej) => {
        geocodeAddress(event.contactInfo.address)
          .then((latLng: { lat: number; lng: number}) => {
            res({
              ...event,
              latLng: {
                latitude: latLng.lat,
                longitude: latLng.lng,
              },
            });
          })
          .catch(err => {
            rej(err);
          });
      }));

    Promise.all(promises).then(geocodedEvents => {
      resolve(geocodedEvents);
    }).catch(err => {
      reject(err);
    });
  });
}
export default geocodeEvents;
