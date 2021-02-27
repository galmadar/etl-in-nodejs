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
import Hospital2Parser from "./parser/hospitalParsers/hospital2Parser";

/* Init connection to mongo */
const mongoConnection = new MongoConnection('mongodb://localhost:27017/etl');

mongoConnection
    .connect(() => {
        logger.debug('connected to DB')
    })
    .then(() => {
        const fileWatcher = new FileWatcher()
        fileWatcher.watch('/Users/galmadar/myProjects/etl-in-nodejs/csvs', fileChanged)
    })

/* Init ParserManager */

const parserManager = new ParsersManager()
parserManager.registerParser(Hospital1Parser.hospitalId, new Hospital1Parser())
parserManager.registerParser(Hospital2Parser.hospitalId, new Hospital2Parser())

const fileChanged = (file) => {
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
    }
    if (parserFunctionByFileName) {
        new CsvParser()
            .parse(file)
            .then(results => {
                for (let i = 0; i < results.length; i++) {
                    let parsedObject = parserFunctionByFileName(results[i]);
                    saveToDbFunction(parsedObject)
                }
            })
    }
}
