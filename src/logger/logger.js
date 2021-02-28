import {createLogger, format, transports} from 'winston';

const logTransports = [
    new transports.File({
        level: 'debug',
        filename: './.logs/trace.log',
        format: format.prettyPrint()
    }),
    new transports.Console({
        level: 'debug',
        format: format.prettyPrint()
    })
];

const logger = createLogger({
    format: format.combine(
        format.timestamp()
    ),
    transports: logTransports,
    defaultMeta: {service: 'api', thread: process.pid}
});

export default logger;
