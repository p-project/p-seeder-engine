import chai, { expect } from 'chai';

chai.config.includeStack = true;

describe('No test', () => {
  it('should pass', () => {
    expect().to.not.exist;
  });
});
