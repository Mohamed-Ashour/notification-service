// TODO explore other options like RabbitMQ or Kafka
const Queue = require('bull');
const schemas = require('./schemas');

const {REDIS_URL} = process.env;

const queues = {
    sms: new Queue('sms', REDIS_URL),
    mail: new Queue('mail', REDIS_URL),
    apns: new Queue('apns', REDIS_URL),
    fcm: new Queue('fcm', REDIS_URL),
};


queues.sms.on('global:completed', (jobId, result) => {
    console.log(`Job ${jobId} completed with result ${result}`);
});

// fine tune according to workers behavior
const DEFAULT_JOB_CONFIG = {
    attempts: 5, // retry if job failed
    backoff: {
        type: 'exponential', // retry strategy
        delay: 10000, // retry delay
    },
};

module.exports = {
    async produce(notification) {
        await schemas.notification.validateAsync(notification);

        // TODO get devices tokens form a token db for services like fcm
        // TODO localize message according to user language

        return queues[notification.provider].add(notification, DEFAULT_JOB_CONFIG);
    },
    queues,
};
