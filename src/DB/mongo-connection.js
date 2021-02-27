import mongoose from 'mongoose';
import logger from '../logger/logger';

export default class MongoConnection {
    /** URL to access mongo */
    mongoUrl;

    /** Callback when mongo connection is established or re-established */
    onConnectedCallback;

    /**
     * Internal flag to check if connection established for
     * first time or after a disconnection
     */
    isConnectedBefore = false;

    /** Mongo connection options to be passed Mongoose */
    mongoConnectionOptions = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    };

    /**
     * Start mongo connection
     * @param mongoUrl MongoDB URL
     */
    constructor(mongoUrl) {
        if (process.env.NODE_ENV === 'development') {
            mongoose.set('debug', true);
        }

        this.mongoUrl = mongoUrl;
        mongoose.connection.on('error', this.onError);
        mongoose.connection.on('disconnected', this.onDisconnected);
        mongoose.connection.on('connected', this.onConnected);
        mongoose.connection.on('reconnected', this.onReconnected);
    }

    /** Close mongo connection */
    close = (onClosed) => {
        logger.log({
            level: 'info',
            message: 'Closing the MongoDB connection'
        });
        // noinspection JSIgnoredPromiseFromCall
        mongoose.connection.close(onClosed);
    }

    /** Start mongo connection */
    connect = (onConnectedCallback) => {
        this.onConnectedCallback = onConnectedCallback;
        return this.startConnection();
    }

    startConnection = () => {
        logger.log({
            level: 'info',
            message: `Connecting to MongoDB at ${this.mongoUrl}`
        });
        return mongoose.connect(this.mongoUrl, this.mongoConnectionOptions).catch(() => {
        });
    }

    /**
     * Handler called when mongo connection is established
     */
    onConnected = () => {
        logger.log({
            level: 'info',
            message: `Connected to MongoDB at ${this.mongoUrl}`
        });
        this.isConnectedBefore = true;
        this.onConnectedCallback();
    };

    /** Handler called when mongo gets re-connected to the database */
    onReconnected = () => {
        logger.log({
            level: 'info',
            message: 'Reconnected to MongoDB'
        });
        this.onConnectedCallback();
    };

    /** Handler called for mongo connection errors */
    onError = () => {
        logger.log({
            level: 'error',
            message: `Could not connect to ${this.mongoUrl}`
        });
    };

    /** Handler called when mongo connection is lost */
    onDisconnected = () => {
        if (!this.isConnectedBefore) {
            setTimeout(() => {
                this.startConnection();
            }, 2000);
            logger.log({
                level: 'info',
                message: 'Retrying mongo connection'
            });
        }
    };
}
