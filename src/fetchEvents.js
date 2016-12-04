// @flow
import moment from 'moment';
import _ from 'lodash';
import 'isomorphic-fetch';

const apiLocale = 'en';
const API_URL_BASE = 'http://visittampere.fi/api/search?type=event';


export const start = (num: number = 0) =>
  moment().add(num, 'days').startOf('day').valueOf();
export const end = (num: number = 6) =>
  moment().add(num, 'days').endOf('day').valueOf();

export function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  // $FlowIssue
  error.response = response;
  throw error;
}

type AIEType = {
  obj: Object;
  prop: string;
  str: string;
  spacer: string;
};
// If object has a property, append string with it using a spacer
export const applyIfExist = ({ obj, prop, str = '', spacer = '' }: AIEType): string => {
  if (obj && {}.hasOwnProperty.call(obj, prop) && !!obj[prop]) {
    return `${str}${spacer}${obj[prop]}`;
  }
  return str;
};

export function parseAddress(contactInfo: VTContactInfo) {
  let address: string = '';
  address = applyIfExist({ obj: contactInfo, prop: 'address', str: address, spacer: '' });
  address = applyIfExist({ obj: contactInfo, prop: 'postcode', str: address, spacer: ', ' });
  if (!contactInfo.city) {
    address += ' Tampere';
  } else {
    address = applyIfExist({ obj: contactInfo, prop: 'city', str: address, spacer: ' ' });
  }
  return address;
}

export function parseEvent(vtEvent: VTEvent): Event {
  const address: string = parseAddress(vtEvent.contact_info);
  const event: Event = {
    id: `event-${vtEvent.item_id}`,
    title: vtEvent.title,
    description: vtEvent.description,
    times: vtEvent.single_datetime
      ? [{ start: (vtEvent: any).start_datetime, end: (vtEvent: any).end_datetime }]
      : vtEvent.times
        .map(time => ({
          start: time.start_datetime,
          end: time.end_datetime,
        }))
        .filter(time => {
          const now = moment();
          const bool = moment(time.start).isBetween(
            moment(now).subtract(1, 'days'),
            moment(now).add(7, 'days')
          );
          return bool;
        }
      ),
    free: vtEvent.is_free,
    ticketLink: vtEvent.ticket_link,
    contactInfo: {
      address,
      email: vtEvent.contact_info.email,
      phone: vtEvent.contact_info.phone,
      link: vtEvent.contact_info.link,
    },
    formContactInfo: {
      email: _.get(vtEvent, 'form_contact_info.email', null),
      phone: _.get(vtEvent, 'form_contact_info.phone', null),
      name: _.get(vtEvent, 'form_contact_info.name', null),
      jobTitle: _.get(vtEvent, 'form_contact_info.jobTitle', null),
    },
    tags: vtEvent.tags,
    image: {
      title: _.get(vtEvent, 'image.title', null),
      uri: _.get(vtEvent, 'image.src', null),
    },
    latLng: null,
  };
  return event;
}

export function parseJSON(response: Response) {
  return response.json();
}

// export function multiplySingleDateEvents(events: Array<VTEvent>) {
//   const singleDateEvents = [];
//   /* TODO handle cases where:
//    * - event has multiple times in same day
//    * - event has dates outside the wanted daterange
//   */
//   events.forEach((event) => {
//     if (event.single_datetime) {
//       singleDateEvents.push(event);
//     } /* else {
//       event.times.forEach((time, index) => {
//         singleDateEvents.push(Object.assign({}, event, {
//           item_id: event.item_id + index * 100000,
//           start_datetime: time.start_datetime,
//           end_datetime: time.end_datetime,
//         }));
//       });
//     }*/
//   });
//   return singleDateEvents;
// }

type GetUrlProps = {
  startDate: Function;
  endDate: Function;
};

export const getUrl = ({ startDate = start, endDate = end }: GetUrlProps) =>
    `${API_URL_BASE}&limit=20&start_datetime=${startDate()}&end_datetime=${endDate()}&lang=${apiLocale}`;


export const fetchEvents = () => new Promise((resolve, reject) => {
  fetch(getUrl({ startDate: start, endDate: end }))
  .then(checkStatus)
  .then(parseJSON)
  .then(data => {
    resolve(data);
  })
  .catch(err => {
    reject(err);
  });
});

export default fetchEvents;
