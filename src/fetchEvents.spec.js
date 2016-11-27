const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {
  checkStatus,
  parseJSON,
  multiplySingleDateEvents,
} = require('./fetchEvents');

// const { expect } = chai;

chai.use(chaiAsPromised);
chai.should();

const debug = { hello: 'world' };

describe('test http shite', () => {
  describe('checkStatus', () => {
    it('should return if status ok', () => {
      const response = { status: 200, statusText: 'ok' };
      const result = checkStatus(response);
      result.should.equal(response);
    });
    it('should throw if error response', () => {
      const response = { status: 500, statusText: 'error' };
      // const result = checkStatus(response);
      checkStatus.bind(checkStatus, response).should.throw('error');
      // result.should.equal(response);
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
