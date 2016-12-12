/**
 * Created by Ajay on 12/7/2016.
 */
module.exports = function () {
    var mongoose = require("mongoose");
    var FriendRequest = mongoose.Schema({
        user: String,
        requestedUser: String,
        requestedOn: {type: Date, default: Date.now()}
    }, {collection:"friend_request"});

    return FriendRequest;
};