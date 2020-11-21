const Queue = require('bull');
const fcmService = require('./provider');

const REDIS_URL = process.env.REDIS_URL;

const fcmQueue = new Queue('fcm', REDIS_URL);

// max number of jobs running concurrently
const MAX_CONCURRENT_JOBS = 100;

fcmQueue.process(MAX_CONCURRENT_JOBS, async (job) => {
    // logic of sending notification to provider goes here
    return fcmService.send(job.data);
});

console.log('Worker is running')
