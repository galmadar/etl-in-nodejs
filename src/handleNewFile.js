import fileChangedQueue from './queueManager';
import MongoConnection from "./DB/mongo-connection";
import logger from "./logger/logger";
import ParsersManager, {parseKeys} from "./parser/parsersManager";
import Hospital1Parser from "./parser/hospitalParsers/hospital1Parser";
import Treatment from "./DB/models/Treatment";
import Patient from "./DB/models/Patient";
import Hospital2Parser from "./parser/hospitalParsers/hospital2Parser";
import child_process from 'child_process';

/* Init mongo, fileWatcher and CSVParser "managers" */
const mongoConnection = new MongoConnection('mongodb://localhost:27017/etl');
const parserManager = new ParsersManager()

const fileChanged = (file, done) => {
    logger.debug(`file changed: ${file}`)
    const fileName = file.substr(file.lastIndexOf('/'))
    const {hospitalsParser, fileType} = parserManager.getParserAndTypeByFileName(fileName);
    let parserFunctionByFileName, saveToDbFunction
    if (hospitalsParser) {
        switch (fileType) {
            case parseKeys.patient:
                parserFunctionByFileName = hospitalsParser.parsePatient
                saveToDbFunction = (p) => {
                    new Patient(p)
                        .save()
                        .then(() => {
                            logger.debug('saved patient to DB')
                        })
                        .catch(err => {
                            logger.error('failed to save patient to DB')
                        })
                }
                break;
            case parseKeys.treatment:
                parserFunctionByFileName = hospitalsParser.parseTreatment
                saveToDbFunction = (p) => {
                    new Treatment(p)
                        .save()
                        .then(() => {
                            logger.debug('saved treatment to DB')
                        })
                        .catch(err => {
                            logger.error('failed to save treatment to DB')
                        })
                }
                break;
        }
    } else {
        logger.error(`parser not found for file: ${fileName}`)
    }
    if (parserFunctionByFileName && saveToDbFunction) {
        parserManager.parseCSV(file)
            .then(results => {
                for (let i = 0; i < results.length; i++) {
                    let parsedObject = parserFunctionByFileName(results[i]);
                    saveToDbFunction(parsedObject)
                }
                done(null, file)
            })
    }
}

const runHandler = (id) => {
    logger.info(`running handler: ${id}`)

    /* Register relevant "hospital parsers" */
    parserManager.registerParser(Hospital1Parser.hospitalId, new Hospital1Parser())
    parserManager.registerParser(Hospital2Parser.hospitalId, new Hospital2Parser())

    /* Connect to mongo */
    mongoConnection
        .connect(() => {
            logger.debug('connected to DB')
        })
        .then(() => {
            fileChangedQueue.process((job, done) => {
                console.log(`job from 'fileChangedQueue' is: ${JSON.stringify(job.data)}`)
                fileChanged(job.data.file, done)
            });
        })
        .catch(err => {
            logger.error('failed to connect to mongoDB')
            logger.error(err.message)
        })
}

runHandler(process.argv[2])

