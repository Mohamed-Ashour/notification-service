const Queue = require('bull');
const apnsService = require('./provider');

const {REDIS_URL} = process.env;

const apnsQueue = new Queue('apns', REDIS_URL);

// max number of jobs running concurrently
const MAX_CONCURRENT_JOBS = 50;

apnsQueue.process(MAX_CONCURRENT_JOBS, async (job) => {
    // logic of sending notification to provider goes here
    return apnsService.send(job.data);
});

console.log('worker is running')
