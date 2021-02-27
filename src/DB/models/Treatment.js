import {model, Schema} from 'mongoose';
import TimeStampPlugin from './plugins/timestamp-plugin';


const schema = new Schema({
    hospitalId: {type: String, index: true, required: true},
    treatmentId: {type: String, index: true, required: true},
    patientId: {type: String, index: true, required: true},
    protocolId: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    displayName: {type: String},
    diagnoses: {type: String},
    numberOfCycles: {type: String},
    status: {type: String},
    active: {type: String},
    treatmentLine: {type: String}
});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const Treatment = model('Treatment', schema);

export default Treatment;
