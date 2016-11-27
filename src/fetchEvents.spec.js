const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
// const fetch = require('node-fetch');
const fetchMock = require('fetch-mock');
// const mockery = require('mockery');
const mockResponse = require('../mockdata/mockresponse');
const {
  checkStatus,
  parseJSON,
  multiplySingleDateEvents,
  fetchEvents,
} = require('./fetchEvents');

chai.use(chaiAsPromised);
chai.should();

const debug = { hello: 'world' };

describe('test http shite', () => {
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
