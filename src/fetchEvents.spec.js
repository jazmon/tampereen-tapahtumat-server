import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fetchMock from 'fetch-mock';
import mockResponse from '../mockdata/mockresponse.json';

import {
  checkStatus,
  parseJSON,
  multiplySingleDateEvents,
  fetchEvents,
  parseAddress,
  applyIfExist,
  parseEvent,
} from './fetchEvents';

chai.use(chaiAsPromised);
chai.should();

const debug = { hello: 'world' };

describe('test http shite', () => {
  describe('applyIfExist', () => {
    it('should apply prop from object to string', () => {
      const expected = 'foo bar';
      const input = 'foo';
      const obj = {
        baz: 'bar',
      };
      applyIfExist({ obj, prop: 'baz', str: input, spacer: ' ' }).should.equal(expected);
    });
    it('should return string back if no prop in object', () => {
      const expected = 'foo';
      const input = 'foo';
      const obj = {
        lol: 'bar',
      };
      applyIfExist({ obj, prop: 'baz', str: input, spacer: ' ' }).should.equal(expected);
    });
    it('should use default params', () => {
      const expected = 'bar';
      const obj = {
        baz: 'bar',
      };
      applyIfExist({ obj, prop: 'baz' }).should.equal(expected);
    });
  });

  describe('parseEvent', () => {
    it('should parse correctly', () => {
      const input = mockResponse[0];
      const expected = {
        id: 'event-15774',
        title: 'The Tampere Christmas Market',
        description: 'The Christmas Market offers relaxing moments and a merry atmosphere, performances to raise your holiday spirits to the fullest. The many artists and craftspeople present and sell their unique Finnish artworks and products. At Keskustori. Open from 3rd to 22nd December 2016. Opening hours: weekdays from 10 am to 7 pm, on Sundays from 12 am to 7 pm. 6th December: from 12 am to 8 pm.',
        start: 0,
        end: 0,
        free: true,
        ticketLink: null,
        contactInfo: {
          address: 'Keskustori Tampere',
          email: null,
          phone: null,
          link: 'http://tampereenjoulutori.fi/en',
        },
        formContactInfo: {
          email: null,
          phone: null,
          name: null,
          jobTitle: null,
        },
        tags: ['market'],
        image: {
          title: 'joulutori.jpg',
          uri: 'http://visittampere.fi/media/f8e07ef0-8c60-11e6-800a-97b270bd95b5.jpg',
        },
        latlng: null,
      };
      parseEvent(input).should.deep.equal(expected);
    });
  });

  describe('parseAddress', () => {
    it('should parse correctly', () => {
      const expected = 'Kuntokatu 3, 33520 Tampere';
      const input: VTContactInfo = {
        address: 'Kuntokatu 3',
        city: 'Tampere',
        postcode: '33520',
      };
      parseAddress(input).should.equal(expected);
    });
    it('should use default city if one not provided', () => {
      const expected = 'Kuntokatu 3, 33520 Tampere';
      const input: VTContactInfo = {
        address: 'Kuntokatu 3',
        city: null,
        postcode: '33520',
      };
      parseAddress(input).should.equal(expected);
    });
  });

  describe('fetchEvents', () => {
    before(() => {
      const response = {
        body: mockResponse,
        headers: {
          pragma: 'no-cache',
          date: 'Sun, 27 Nov 2016 17:30:40 GMT',
          'content-encoding': 'gzip',
          server: 'nginx/1.6.2',
          age: '0',
          'transfer-encoding': 'chunked',
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-cache',
          connection: 'keep-alive',
          'x-total-count': '15',
        },
      };
      const options = {
        response,
        method: 'GET',
        matcher: '*',
        times: 1,
      };
      fetchMock.mock(options);

      fetchMock.mock('*', { status: 404, throws: 'lol' });
    });

    after(() => {
      fetchMock.restore();
    });

    it('should fetch events', (done) => {
      const promise = fetchEvents();
      fetchMock.called('*').should.equal(true);
      promise.should.eventually.to.eql(mockResponse).notify(done);
    });

    it('should catch errors', (done) => {
      const promise = fetchEvents();
      promise.should.eventually.be.rejectedWith('lol').notify(done);
    });
  });

  describe('checkStatus', () => {
    it('should return if status ok', () => {
      const response = { status: 200, statusText: 'ok' };
      const result = checkStatus(response);
      result.should.equal(response);
    });

    it('should throw if error response', () => {
      const response = { status: 500, statusText: 'error' };
      checkStatus.bind(checkStatus, response).should.throw('error');
    });
  });

  describe('parseJSON', () => {
    it('should parse response json correctly', async () => {
      const response = {
        status: 200,
        statusText: 'ok',
        json: () => new Promise((resolve) => {
          setTimeout(() => {
            resolve(debug);
          }, 0);
        }),
      };

      const expected = debug;
      const result = await parseJSON(response);
      result.should.equal(expected);
    });

    it('should throw if invalid JSON', async () => {
      const response = {
        status: 200,
        statusText: 'ok',
        json: () => new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('test'));
          }, 0);
        }),
      };
      parseJSON(response).should.eventually.be.rejectedWith('test');
    });
  });

  describe('multiplySingleDateEvents', () => {
    it('should not throw if no events', () => {
      multiplySingleDateEvents([]).should.have.lengthOf(0);
    });

    it('should return more events if one multiple datetime was given', () => {
      const events = [0, 1].map((e, i) => ({
        single_datetime: i % 2 === 0,
        item_id: i,
        start_datetime: i % 2 === 0 ? 1234 : undefined,
        end_datetime: i % 2 === 0 ? 4567 : undefined,
        times: i % 2 === 0 ? undefined : [{
          start_datetime: 1234,
          end_datetime: 4567,
        }, {
          start_datetime: 14124123,
          end_datetime: 46346346,
        }],
      }));

      multiplySingleDateEvents(events).should.have.length.above(events.length);
    });

    it('should return the same amount if no multiple datetime events were given', () => {
      const events = [0, 1].map((e, i) => ({
        single_datetime: true,
        item_id: i,
        start_datetime: 1234,
        end_datetime: 4567,
        times: [],
      }));

      multiplySingleDateEvents(events).should.have.lengthOf(events.length);
    });
  });
});
