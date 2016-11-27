// const chai = require('chai');
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import mockResponse from '../mockdata/mockresponse.json';
import {
  geocodeAddress,
  geocodeEvents,
} from './geocodeEvent';

import { parseEvent } from './fetchEvents';

chai.use(chaiAsPromised);
chai.should();

describe('geocoding', () => {
  describe('geocode address', () => {
    it('should geocode address', (done) => {
      geocodeAddress('Kuntokatu 3, 33520 Tampere').should.eventually.have.all.keys({
        lat: 61.50380639999999, lng: 23.8088393,
      }).notify(done);
    });
    it('should reject if incorrect address', (done) => {
      geocodeAddress('Kuntokatuasdfasd 3').should.eventually.be.rejectedWith('ZERO_RESULTS').notify(done);
    });
  });

  describe('geocode all events', () => {
    it('should geocode all events', (done) => {
      const input = mockResponse.map(parseEvent);
      geocodeEvents(input).should.eventually.be.fulfilled.notify(done);
    });
  });

  describe('construct address', () => {
    it('should construct address properly', () => {

    });
  });
});
