// @flow
import _get from 'lodash/get';
import _unionWith from 'lodash/unionWith';
import 'isomorphic-fetch';
import startOfDay from 'date-fns/start_of_day';
import addDays from 'date-fns/add_days';
import endOfDay from 'date-fns/end_of_day';

const apiLocale = 'fi';
const API_URL_BASE = 'http://visittampere.fi/api/search?type=event';

export const start = (num: number = 0): number =>
  startOfDay(addDays(new Date(), num)).getTime();

export const end = (num: number = 6): number =>
  endOfDay(addDays(new Date(), num)).getTime();

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
        })),
    free: vtEvent.is_free,
    ticketLink: vtEvent.ticket_link,
    contactInfo: {
      address,
      email: vtEvent.contact_info.email,
      phone: vtEvent.contact_info.phone,
      link: vtEvent.contact_info.link,
    },
    formContactInfo: {
      email: _get(vtEvent, 'form_contact_info.email', null),
      phone: _get(vtEvent, 'form_contact_info.phone', null),
      name: _get(vtEvent, 'form_contact_info.name', null),
      jobTitle: _get(vtEvent, 'form_contact_info.jobTitle', null),
    },
    tags: vtEvent.tags,
    image: {
      title: _get(vtEvent, 'image.title', null),
      uri: _get(vtEvent, 'image.src', null),
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
    `${API_URL_BASE}&limit=1000&start_datetime=${startDate()}&end_datetime=${endDate()}&lang=${apiLocale}`;


export const fetchEvents = () => new Promise((resolve, reject) => {
  const promises = [0, 1, 2, 3, 4, 5, 6]
    .map((i) => getUrl({ startDate: start.bind(null, i), endDate: end.bind(null, i) }))
    .map(url => new Promise((res, rej) => {
      fetch(url)
        .then(checkStatus)
        .then(parseJSON)
        .then(res)
        .catch(rej);
    }));
  Promise.all(promises)
    .then(data => {
      const unique = _unionWith(...data, 'id');
      // const flattened = data.reduce((a, b) => a.concat(b), []);
      resolve(unique);
    })
    .catch(err => reject(err));
});

export default fetchEvents;
