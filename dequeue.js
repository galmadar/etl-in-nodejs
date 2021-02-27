const Queue = require('bee-queue');
const redis = require('redis');
const sharedConfig = {
    redis: redis.createClient('redis://localhost:6379'),
};

const emailQueue = new Queue('EMAIL_DELIVERY2', sharedConfig);

emailQueue.process((job, done) => {
    console.log(`job from emailQueue is: ${JSON.stringify(job.data)}`)
    done(null, job.data)
});
