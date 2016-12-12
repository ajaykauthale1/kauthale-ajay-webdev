/**
 * Created by Ajay on 12/8/2016.
 */
module.exports = function () {
    var mongoose = require("mongoose");
    var EventSchema = mongoose.Schema({
        name: String,
        creator: mongoose.Schema.Types.ObjectId,
        description: String,
        location: String,
        photoUrl: String,
        dateOfEvent: String,
        time: String,
        eventbrite: {
            id:    String,
            token: String
        },
        attendees: [{type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}],
        requestedUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}],
        dateCreated: {type: Date, default: Date.now()}
    },{collection:"event"});

    return EventSchema;
};