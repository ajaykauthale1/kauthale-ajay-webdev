module.exports = function () {
    var mongoose = require("mongoose");
    var UserSchema = mongoose.Schema({
        _friend: [{type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}],
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
        role: {type: String, default: 'USER', enum: ['ADMIN', 'USER']},
        email: String,
        phone: String,
        occupation: String,
        photoUrl: String,
        friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}],
        friendRequests: [{type: mongoose.Schema.Types.ObjectId, ref: 'FriendRequestModel'}],
        dateCreated: {type: Date, default: Date.now()}
    },{collection:"user"});
    return UserSchema;

};