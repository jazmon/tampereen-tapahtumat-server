/* eslint-disable no-undef */

//
// Geocode service
// _____________________

declare type GeoCode = {
  position: {lat: number; lng: number};
  formattedAddress: string; // the full address
  feature: ?string; // ex Yosemite Park, Eiffel Tower
  streetNumber: ?string;
  streetName: ?string;
  postalCode: ?string;
  locality: ?string; // city name
  country: string;
  countryCode: string;
  adminArea: ?string;
  subAdminArea: ?string;
  subLocality: ?string;
};

//
// visittampere.fi API
// ____________________

declare type VTImage = {
  item_id: number;
  src: string;
  title: string;
}

declare type VTContactInfo = {
  id: number;
  address: ?string;
  postcode: ?string;
  city: ?string;
  country: ?string;
  phone: ?string;
  email: ?string;
  link: ?string;
  company_name: ?string;
  company_id: ?string | ?number;
  place_of_business: ?any;
};

declare type VTApiType = 'event' | 'article' | 'location';

declare type VTTime = {
  id: number;
  start_datetime: number;
  end_datetime: number;
};

declare type VTFormContactInfo = {
  name: string;
  email: ?string;
  phone: ?string;
  job_title: ?string;
};

declare type VTTag =
  'festival'
| 'music'
| 'for-children'
| 'other-event'
| 'dance'
| 'market'
| 'sports'
| 'entertainment'
| 'theatre'
| 'guided-tour'
| 'trade-fair'
| 'movie';

declare type VTEvent = {
  item_id: number;
  lang: string;
  title: string;
  description: string;
  contact_info: VTContactInfo;
  created_at: number;
  updated_at: number;
  image?: VTImage;
  start_datetime: ?number;
  end_datetime: ?number;
  type: VTApiType;
  tags: Array<VTTag>;
  is_free: boolean;
  ticket_link: ?string;
  is_public: boolean;
  has_articles: boolean;
  single_datetime: boolean;
  times: Array<VTTime>;
  form_contact_info: ?VTFormContactInfo;
  is_in_moderation: boolean;
};
