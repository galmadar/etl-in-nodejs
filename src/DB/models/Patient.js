import {model, Schema} from 'mongoose';
import TimeStampPlugin from './plugins/timestamp-plugin';


const schema = new Schema({
    hospitalId: {type: String, index: true, required: true},
    patientId: {type: String, required: true},
    firstName: {type: String},
    lastName: {type: String},
    mrn: {type: String},
    patientDOB: {type: Date},
    deathDate: {type: Date},
    isDeceased: {type: String},
    gender: {type: String},
    sex: {type: String},
    address: {type: String},
    city: {type: String},
    state: {type: String},
    zipCode: {type: String},
    lastModifiedDate: {type: Date},
    dod_ts: {type: Date}
});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const Patient = model('Patient', schema);

export default Patient;
