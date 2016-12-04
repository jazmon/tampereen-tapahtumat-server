/* eslint-disable no-undef */
declare type Event = {
  id: string;
  title: string;
  description: string;
  latlng: LatLng;
  times: Array<{
    start: number;
    end: number;
  }>;
  tags: Array<string>;
  free: boolean;
  ticketLink: ?string;
  contactInfo: {
    address: ?string;
    email: ?string;
    phone: ?string;
    link: ?string;
    companyName: ?string;
  };
  formContactInfo: {
    email: ?string;
    phone: ?string;
    name: ?string;
    jobTitle: ?string;
  };
  image: {
    title: string;
    uri: string;
  };
};
