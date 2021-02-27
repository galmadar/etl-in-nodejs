import FileWatcher from "./watcher/fileWatcher";
import fileChangedQueue from './queueManager'
import logger from "./logger/logger";

const fileWatcher = new FileWatcher()
let dirPath = `${__dirname}/csvs`;

const fileChanged = (file) => {
    fileChangedQueue
        .createJob({file})
        .save()
        .then((job) => {
            logger.info(`enqueue file: ${file}`)
        })
}

export default function () {
    fileWatcher.watch(dirPath, fileChanged)
}
