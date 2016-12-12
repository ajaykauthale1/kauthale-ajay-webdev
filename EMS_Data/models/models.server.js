/**
 * Created by Ajay on 11/13/2016.
 */
module.exports = function() {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/ems-2016');

    var userModel = require("./user/user.model.server")();
    var connectionModel = require("./friend/friend_connection.model.server")();
    var friendRequestModel = require("./friend_request/friend_request.model.server")();
    var eventModel = require("./event/event.model.server")();

    var model = {
        userModel: userModel,
        connectionModel: connectionModel,
        friendRequestModel: friendRequestModel,
        eventModel: eventModel
    };

    userModel.setModel(model);
    connectionModel.setModel(model);
    friendRequestModel.setModel(model);
    eventModel.setModel(model);

    return model;
};
