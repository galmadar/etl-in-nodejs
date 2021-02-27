import Queue from 'bee-queue';
import redis from 'redis';

const sharedConfig = {
    redis: redis.createClient('redis://localhost:6379'),
};

export default new Queue('FILE_CHANGED_QUEUE', sharedConfig);
