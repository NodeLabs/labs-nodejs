"use strict";
const Mongoose = require("mongoose");
exports.Schema = new Mongoose.Schema({
    lastName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/
    },
    course: {
        type: String,
        required: true
    }
});
exports.Model = Mongoose.model('Participant', exports.Schema);
//# sourceMappingURL=Participant.js.map