const Queue = require('bull');
const mailService = require('./provider');

const {REDIS_URL} = process.env;

const QUEUE_CONFIG = {
    limiter: {
        duration: 60000, // duration of rate limiting
        max: 20, // max number of jobs processed in the duration
    },
};

const mailQueue = new Queue('mail', REDIS_URL, QUEUE_CONFIG);

// max number of jobs running concurrently
const MAX_CONCURRENT_JOBS = 5;

mailQueue.process(MAX_CONCURRENT_JOBS, async (job) => {
    // logic of sending notification to provider goes here
    return mailService.send({  id: job.id, ...job.data });
});

console.log('Worker is running')
