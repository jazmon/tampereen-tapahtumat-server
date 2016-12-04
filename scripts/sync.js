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
  await sequelize.sync();
  let events = mockEvents;
  events = multiplySingleDateEvents(events);
  events = events.map(parseEvent);
  events = await geocodeEvents(events);
  events = events.filter(event => !!event.latLng);
  // console.log(events);

  events.forEach(async e => {
    // TODO transactions
    // const contactInfo = await createContactInfo(e);
    // const formContactInfo = await createFormContactInfo(e);
    // const image = await createImage(e);
    //
    // const event = Event.build({
    //   apiID: e.id,
    //   title: e.title,
    //   description: e.description,
    //   latitude: e.latLng.latitude,
    //   longitude: e.latLng.longitude,
    //   start: e.start,
    //   end: e.end,
    //   // seems like there's always just 1 tag, which is the type
    //   type: e.tags[0],
    //   free: e.free,
    //   ticketLink: e.ticketLink,
    // });
    console.log('e', e);
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
};

export default sync;
