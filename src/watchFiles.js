import FileWatcher from "./watcher/fileWatcher";
import fileChangedQueue from './queueManager'
import logger from "./logger/logger";

const fileWatcher = new FileWatcher()
let dirPath = `${__dirname}/csvs`;

logger.info(`Watching files in dir:: ${dirPath}`)

const fileChanged = (file) => {
    logger.info(`FileChanged: ${file}`)
    fileChangedQueue
        .createJob({file})
        .save()
        .then((job) => {
            logger.info(`Enqueued file: ${file}`)
        })
}

export default function () {
    fileWatcher.watch(dirPath, fileChanged)
}
