import csv from 'csv-parser'
import MongoConnection from "./DB/mongo-connection";
import logger from "./logger/logger";
import FileChanged from "./DB/models/FileChanged";
import FileWatcher from "./watcher/fileWatcher";
import CsvParser from "./parser/csvParser";
import ParsersManager, {parseKeys} from "./parser/parsersManager";
import Hospital1Parser from "./parser/hospitalParsers/hospital1Parser";
import Treatment from "./DB/models/Treatment";
import Patient from "./DB/models/Patient";

/* Init variables */
const mongoConnection = new MongoConnection('mongodb://localhost:27017/etl');
const fileWatcher = new FileWatcher()


mongoConnection
    .connect(() => {
        logger.debug("Connected to mongo");
    })
// .then(() => {
//     /* Watch over directory of the .csv files */
//     fileWatcher.watch('/Users/galmadar/myProjects/etl-in-nodejs/.csvs', (...args) => {
//         logger.info(`file changed with args: ${args}`)
//     })
// })


// const fc = new FileChanged({name: "two"})
// fc.save()
//     .then(saved => {
//         if (saved)
//             return saved
//     })
//     .then(r => {
//         return new Promise(res => {
//             setTimeout(() => {
//                 res(r)
//             }, 5000)
//         })
//     })
//     .then(saveddd => {
//
//         saveddd.name = "papa"
//         return saveddd.save()
//     })


const parserManager = new ParsersManager()
parserManager.registerParser(Hospital1Parser.hospitalId, new Hospital1Parser())

const csvParser = new CsvParser()
// csvParser
//     .parse('/Users/galmadar/myProjects/etl-in-nodejs/.csvs/hospital_1_Treatment.csv')
//     .then(results => {
//         logger.info('results from files are::')
//         logger.info(results)
//         for (let i = 0; i < results.length; i++) {
//             let currentRow = results[i];
//             logger.info(`currentRow: ${JSON.stringify(currentRow)}`)
//             const parsedResult = parserManager.parse(Hospital1Parser.hospitalId, parseKeys.treatment, currentRow)
//             if (parsedResult != null) {
//                 const newTreatment = new Treatment(parsedResult)
//                 logger.info(`newTreatment: ${newTreatment}`)
//                 newTreatment.save()
//                     .then((saved) => {
//                         logger.debug('treatment saved')
//                     })
//                     .catch(err => {
//                         logger.error('error in saving treatment')
//                         logger.error(err.message)
//                     })
//             }
//         }
//     })
csvParser
    .parse('/Users/galmadar/myProjects/etl-in-nodejs/.csvs/hospital_1_Patient.csv')
    .catch(err => {
        logger.error(`error in parse file`)
        logger.error(err)
    })
    .then((r) => {
        return new Promise(res => {
            setTimeout(() => {
                res(r)
            }, 4500)
        })
    })
    .then(results => {
        logger.info('results from files are:')
        logger.info(results)
        for (let i = 0; i < results.length; i++) {
            let currentRow = results[i];
            logger.info(`currentRow: ${JSON.stringify(currentRow)}`)
            const parsedResult = parserManager.parse(Hospital1Parser.hospitalId, parseKeys.patient, currentRow)
            if (parsedResult != null) {
                const newPatient = new Patient(parsedResult)

                logger.info(`newPatient: ${newPatient}`)
                newPatient.save()
                    .then((saved) => {
                        logger.debug('treatment saved')
                    })
                    .catch(err => {
                        logger.error('error in saving treatment')
                        logger.error(err.message)
                    })
            }
        }
    })
    .catch(err => {
        logger.error('error in parse csv')
        logger.error(err.message)
    })

