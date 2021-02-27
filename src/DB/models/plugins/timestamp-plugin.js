const TimeStampPlugin = function (schema) {
    schema.add({createdAt: {type: Date, index: true}});
    schema.add({updatedAt: {type: Date, index: true}});

    schema.pre('save', function (next) {
        if (this.isNew) {
            this.createdAt = new Date();
        }
        this.updatedAt = new Date();
        next();
    });
};

export default TimeStampPlugin;
