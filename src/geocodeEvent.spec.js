const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
// const fetchMock = require('fetch-mock');
// const mockResponse = require('../mockdata/mockresponse');
const {
  geocodeAddress,
} = require('./geocodeEvent');

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
    it('should geocode all events');
  });

  describe('construct address', () => {
    it('should construct address properly', () => {

    });
  });
});
