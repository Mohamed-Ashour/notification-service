const chai = require('chai');
chai.use(require('chai-as-promised'));
const { expect } = chai;

const {produce} = require('../../server/producer');
const notificationSample = require('../samples/notification');

describe('server/producer', () => {
    it('should add a notification to queue and return created job', async () => {
        const result = await produce(notificationSample)

        expect(result).to.be.an('object');
        expect(result).to.contain.keys(['id', 'data', 'opts', 'timestamp']);
        expect(result.id).to.be.a('string');
        expect(result.data).to.deep.equal(notificationSample);
    });

    it('should validate notification and return validation error', async () => {
        const promise = produce({...notificationSample, provider: 'invalid'})
        const error = await expect(promise).to.be.eventually
            .rejectedWith(Error);
        expect(error).to.have.keys(['_original', 'details'])
        expect(error.name).to.equal('ValidationError')
        expect(error.details).to.be.an('array')
    });
});
