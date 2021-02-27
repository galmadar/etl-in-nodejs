import logger from "../logger/logger";

export const parseKeys = {
    patient: 'Patient',
    treatment: 'Treatment'
}

export default class ParsersManager {
    hospitalsParsers = {}
    r = new RegExp('hospital_(.*)_(.*).csv')

    registerParser = (hospitalId, hospitalParser) => {
        this.hospitalsParsers[hospitalId] = hospitalParser;
    }

    getParserAndTypeByFileName = (fileName) => {
        const regexExecArr = this.r.exec(fileName)
        if (regexExecArr != null) {
            const hospitalId = regexExecArr[1];
            const fileType = regexExecArr[2];
            let hospitalsParser = this.hospitalsParsers[hospitalId];

            return {
                hospitalsParser,
                fileType
            }
        }

        return null;
    }
}
