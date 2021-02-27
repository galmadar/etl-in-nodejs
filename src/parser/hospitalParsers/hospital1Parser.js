import moment from 'moment'
import logger from "../../logger/logger";

export default class Hospital1Parser {

    static hospitalId = "1"

    parsePatient = (csvRow) => {
        const patientId = csvRow.PatientID
        if (patientId != null) {
            return {
                hospitalId: Hospital1Parser.hospitalId,
                patientId: patientId,
                mrn: csvRow.MRN,
                firstName: csvRow.FirstName,
                lastName: csvRow.LastName,
                patientDOB: this.parseDate(csvRow.PatientDOB),
                isDeceased: csvRow.IsDeceased,
                gender: csvRow.Gender,
                sex: csvRow.Sex,
                address: csvRow.Address,
                city: csvRow.City,
                state: csvRow.State,
                zipCode: csvRow.ZipCode,
                lastModifiedDate: csvRow.LastModifiedDate,
                dod_ts: csvRow.DOD_TS,
            }
        }

        return null;
    }

    parseDate = (strDate) => {
        logger.debug(`try to parse date ${strDate}`)

        let date = moment(strDate, 'M/D/YYYY H:m:s')
        if (date.isValid()) {
            return date.toDate()

        } else {
            date = moment(strDate, 'M/D/YYYY H:m')
            if (date.isValid()) {
                return date.toDate()
            }
        }
        return null
    }

    parseTreatment = (csvRow) => {
        const patientId = csvRow.PatientID
        const treatmentId = csvRow.TreatmentID

        logger.debug(`patientId: ${patientId}, treatmentId: ${treatmentId}`)

        if (patientId != null && treatmentId != null) {
            return {
                hospitalId: Hospital1Parser.hospitalId,
                patientId: patientId,
                treatmentId: treatmentId,
                protocolId: null,
                startDate: this.parseDate(csvRow.StartDate),
                endDate: this.parseDate(csvRow.EndDate),
                displayName: csvRow.DisplayName,
                diagnoses: csvRow.Diagnoses,
                numberOfCycles: csvRow.CyclesXDays,
                status: null,
                active: csvRow.Active,
                treatmentLine: csvRow.TreatmentLine,
            }
        }

        return null;
    }
}
