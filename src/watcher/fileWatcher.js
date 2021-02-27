import chokidar from 'chokidar';

export default class FileWatcher {
    watch = (dirPath, cbOnChange) => {
        this.watcher = chokidar.watch(dirPath)
        this.watcher.on('add', (filePath, stats) => {
            if (filePath.endsWith(".csv")) {
                cbOnChange(filePath, stats)
            }
        })
    }
}
