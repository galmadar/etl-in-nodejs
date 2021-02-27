import {model, Schema} from 'mongoose';
import TimeStampPlugin from './plugins/timestamp-plugin';


const schema = new Schema({
    name: {type: String, index: true, required: true},
    creationDate: {type: Date, index: true, required: true, default: new Date()},
});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const FileChanged = model('FileChanged', schema);

export default FileChanged;
