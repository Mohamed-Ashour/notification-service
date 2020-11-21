const Queue = require('bull');
const smsService = require('./provider');

const REDIS_URL = process.env.REDIS_URL;

const QUEUE_CONFIG = {
    limiter: {
        duration: 60000, // duration of rate limiting
        max: 50, // max number of jobs processed in the duration
    },
};

const smsQueue = new Queue('sms', REDIS_URL, QUEUE_CONFIG);

// max number of jobs running concurrently
const MAX_CONCURRENT_JOBS = 10;

smsQueue.process(MAX_CONCURRENT_JOBS, async (job) => {
    // logic of sending notification to provider goes here
    return smsService.send({ ...job.data, id: job.id });
});

console.log('Worker is running')
