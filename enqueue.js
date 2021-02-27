// worker queues running on the worker server
const Queue = require('bee-queue');
const redis = require('redis');
const sharedConfig = {
    redis: redis.createClient('redis://localhost:6379'),
};


let onfulfilled = job => {
    console.log("saved job:", job.data)
};

const emailQueue = new Queue('EMAIL_DELIVERY2', sharedConfig);
let job1 = emailQueue.createJob({abc: 'a'}).save().then(onfulfilled);
let job2 = emailQueue.createJob({abc: 'b'}).save().then(onfulfilled);
let job3 = emailQueue.createJob({abc: 'c'}).save().then(onfulfilled);
let job4 = emailQueue.createJob({abc: 'd'}).save().then(onfulfilled);
