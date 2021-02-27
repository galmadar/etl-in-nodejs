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
                mrn: this.parseNotNull(csvRow.MRN),
                firstName: this.parseNotNull(csvRow.FirstName),
                lastName: this.parseNotNull(csvRow.LastName),
                patientDOB: this.parseDate(csvRow.PatientDOB),
                isDeceased: this.parseNotNull(csvRow.IsDeceased),
                gender: this.parseNotNull(csvRow.Gender),
                sex: this.parseNotNull(csvRow.Sex),
                address: this.parseNotNull(csvRow.Address),
                city: this.parseNotNull(csvRow.City),
                state: this.parseNotNull(csvRow.State),
                zipCode: this.parseNotNull(csvRow.ZipCode),
                lastModifiedDate: this.parseNotNull(csvRow.LastModifiedDate),
                dod_ts: this.parseNotNull(csvRow.DOD_TS),
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

    parseNotNull = (val) => {
        return val && val.toLowerCase() !== 'null' ? val : undefined
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
                startDate: this.parseDate(csvRow.StartDate),
                endDate: this.parseDate(csvRow.EndDate),
                displayName: this.parseNotNull(csvRow.DisplayName),
                diagnoses: this.parseNotNull(csvRow.Diagnoses),
                numberOfCycles: this.parseNotNull(csvRow.CyclesXDays),
                active: this.parseNotNull(csvRow.Active),
                treatmentLine: this.parseNotNull(csvRow.TreatmentLine),
            }
        }

        return null;
    }
}
