import moment from 'moment'
import logger from "../../logger/logger";

export default class Hospital2Parser {

    static hospitalId = "2"

    parsePatient = (csvRow) => {
        const patientId = csvRow.PatientId
        if (patientId != null) {
            return {
                hospitalId: Hospital2Parser.hospitalId,
                patientId: patientId,
                mrn: this.parseNotNull(csvRow.MRN),
                firstName: this.parseNotNull(csvRow.FirstName),
                lastName: this.parseNotNull(csvRow.LastName),
                patientDOB: this.parseDate(csvRow.PatientDOB),
                deathDate: this.parseDate(csvRow.DeathDate),
                isDeceased: this.parseDate(csvRow.IsPatientDeceased),
                gender: this.parseNotNull(csvRow.Gender),
                sex: this.parseNotNull(csvRow.Sex),
                address: this.parseNotNull(csvRow.AddressLine),
                city: this.parseNotNull(csvRow.AddressCity),
                state: this.parseNotNull(csvRow.AddressState),
                zipCode: this.parseNotNull(csvRow.AddressZipCode),
                lastModifiedDate: this.parseNotNull(csvRow.LastModifiedDate)
            }
        }

        return null;
    }

    parseNotNull = (val) => {
        return val && val.toLowerCase() !== 'null' ? val : undefined
    }

    parseDate = (strDate) => {
        logger.debug(`try to parse date ${strDate}`)
        let regExp = new RegExp('null', 'i');
        if (regExp[Symbol.match](strDate)) {
            return undefined
        }

        let date = moment(strDate, 'M/D/YYYY')
        if (date.isValid()) {
            return date.toDate()

        } else {
            date = moment(strDate, 'M/D/YYYY H:m')
            if (date.isValid()) {
                return date.toDate()
            }
        }
        return undefined
    }

    parseTreatment = (csvRow) => {
        const patientId = csvRow.PatientId
        const treatmentId = csvRow.ProtocolID

        logger.debug(`patientId: ${patientId}, treatmentId: ${treatmentId}`)

        if (patientId != null && treatmentId != null) {
            return {
                hospitalId: Hospital2Parser.hospitalId,
                patientId: patientId,
                treatmentId: treatmentId,
                startDate: this.parseDate(csvRow.StartDate),
                endDate: this.parseDate(csvRow.EndDate),
                displayName: this.parseNotNull(csvRow.DisplayName),
                diagnoses: this.parseNotNull(csvRow.AssociatedDiagnoses),
                numberOfCycles: this.parseNotNull(csvRow.NumberOfCycles),
                status: this.parseNotNull(csvRow.Status),
            }
        }

        return null;
    }
}

