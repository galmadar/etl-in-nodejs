import logger from "../logger/logger";

export const parseKeys = {
    patient: 'patient',
    treatment: 'treatment'
}

export default class ParsersManager {
    hospitalsParsers = {}

    registerParser = (hospitalId, hospitalParser) => {
        this.hospitalsParsers[hospitalId] = hospitalParser;
    }

    parse = (hospitalId, parseKey, csvRow) => {
        logger.debug(`in parse with '${hospitalId}', '${parseKey}', {${JSON.stringify(csvRow)}}`)

        const hospitalParser = this.hospitalsParsers[hospitalId]
        switch (parseKey) {
            case parseKeys.patient:
                logger.debug('patient case')
                return hospitalParser.parsePatient(csvRow);
            case parseKeys.treatment:
                logger.debug('treatment case')
                return hospitalParser.parseTreatment(csvRow);
            default:
                logger.warn('no correct parseKey sent')
        }

        return null;
    }
}
