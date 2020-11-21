const {expect} = require('chai');
const supertest = require('supertest');
const api = require('../../server/api');
const notificationSample = require('../samples/notification');

describe('server/api', () => {
    describe('POST /notification', () => {
        it('should add a notification to queue and return job id', async () => {
            const response = await supertest(api)
                .post('/notification')
                .send(notificationSample)
                .expect(200);

            expect(response.body).to.be.an('object');
            expect(response.body).to.have.keys(['id']);
            expect(response.body.id).to.be.a('string');
        });

        it('should validate notification and return validation error', async () => {
            const response = await supertest(api)
                .post('/notification')
                .send({...notificationSample, provider: 'invalid'})
                .expect(400);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.keys(['error', 'type']);
            expect(response.body.type).to.equal('ValidationError');
            expect(response.body.error).to.have.keys(['_original', 'details']);
        });
    });
});
