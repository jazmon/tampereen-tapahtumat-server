const { expect } = require('chai');
const {
  start,
  end,
  checkStatus,
  parseJSON,
  multiplySingleDateEvents,
} = require('../');

describe('test http shite', () => {
  describe('checkStatus', () => {
    it('should return if status ok', () => {
      const response = { status: 203, statusText: 'ok' };
      const answer = checkStatus(response);
      expect(response.should.equal(answer));
    });
  });
});
