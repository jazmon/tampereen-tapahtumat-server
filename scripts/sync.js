// @flow
import {
  fetchEvents,
  multiplySingleDateEvents,
  parseEvent,
} from '../src/fetchEvents';
import {
  geocodeEvents,
} from '../src/geocodeEvent';

import mockEvents from '../mockdata/mockresponse.json';

import { Event, ContactInfo, Image, FormContactInfo, sequelize } from '../models';

const sync = async () => {
  await sequelize.drop();
  console.log('sequelize: dropped tables');
  await sequelize.sync();
  console.log('sequelize: synced');
  let events = await fetchEvents();
  // let events = mockEvents;
  console.log('script: events fetched', events.length);
  events = multiplySingleDateEvents(events);
  console.log('script: multiplied events', events.length);
  events = events.map(parseEvent);
  console.log('script: parsed events', events.length);
  events = await geocodeEvents(events);
  console.log('script: geocoded events', events.length);

  // events = events.filter(event => !!event.latLng);

  events.forEach(async e => {
    // console.log('e', e);
    // TODO transactions
    try {
      const event = await Event.create({
        apiID: e.id,
        title: e.title,
        description: e.description,
        latitude: e.latLng.latitude,
        longitude: e.latLng.longitude,
        start: e.start,
        end: e.end,
        // seems like there's always just 1 tag, which is the type
        type: e.tags[0],
        free: e.free,
        ticketLink: e.ticketLink,
        contactInfo: {
          address: e.contactInfo.address,
          email: e.contactInfo.email,
          phone: e.contactInfo.phone,
          link: e.contactInfo.link,
          companyName: e.contactInfo.companyName,
        },
        formContactInfo: {
          name: e.formContactInfo.name,
          email: e.formContactInfo.email,
          phone: e.formContactInfo.phone,
          jobTitle: e.formContactInfo.jobTitle,
        },
        image: {
          title: e.image.title,
          uri: e.image.uri,
        },
      });
      console.log('event created');
    } catch (err) {
      console.error('error', err);
    }
  });
  // sequelize.close();
};

export default sync;
