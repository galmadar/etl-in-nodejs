import csv from 'csv-parser'
import fs from 'fs'
import logger from "../logger/logger";

export default class CsvParser {
    parse = (filePath) => {
        return new Promise((res, rej) => {
            try {
                const results = [];
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => {
                        logger.debug('data from pipe is:')
                        logger.debug(data)
                        results.push(data)
                    })
                    .on('end', () => {
                        res(results)
                    })
            } catch (err) {
                rej(err)
            }
        })
    }
}
