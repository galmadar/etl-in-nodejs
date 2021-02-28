import watchFiles from './watchFiles'
import child_process from "child_process";


const handleNewFile = (howManyHandlersToRun) => {
    for (let i = 0; i < howManyHandlersToRun; i++) {
        child_process.fork(`${__dirname}/handleNewFile.js`, [`handler-${i}`])
    }
}

handleNewFile(2)
watchFiles()
