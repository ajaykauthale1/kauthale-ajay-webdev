module.exports = function () {
    var mongoose = require("mongoose");
    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        google: {
            id: String,
            token: String
        },
        facebook: {
            id:    String,
            token: String
        },
        role: {type: String, default: 'STUDENT', enum: ['ADMIN', 'STUDENT', 'FACULTY']},
        email: String,
        phone: String,
        websites: [{type: mongoose.Schema.Types.ObjectId, ref: 'WebsiteModel'}],
        dateCreated: {type: Date, default: Date.now()}
    },{collection:"user"});
    return UserSchema;

};