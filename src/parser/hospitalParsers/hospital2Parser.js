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
                mrn: csvRow.MRN,
                firstName: csvRow.FirstName,
                lastName: csvRow.LastName,
                patientDOB: this.parseDate(csvRow.PatientDOB),
                deathDate: this.parseDate(csvRow.DeathDate),
                isDeceased: csvRow.IsPatientDeceased,
                gender: csvRow.Gender,
                sex: csvRow.Sex,
                address: csvRow.AddressLine,
                city: csvRow.AddressCity,
                state: csvRow.AddressState,
                zipCode: csvRow.AddressZipCode,
                lastModifiedDate: csvRow.LastModifiedDate
            }
        }

        return null;
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
                displayName: csvRow.DisplayName,
                diagnoses: (csvRow.AssociatedDiagnoses != null && csvRow.AssociatedDiagnoses.toLowerCase() !== 'null') ? csvRow.AssociatedDiagnoses : undefined,
                numberOfCycles: csvRow.NumberOfCycles,
                status: csvRow.Status,
            }
        }

        return null;
    }
}

