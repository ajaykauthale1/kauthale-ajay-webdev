/**
 * Created by Ajay on 12/7/2016.
 */
module.exports = function () {
    var model = {};
    var mongoose = require("mongoose");
    var FriendRequestSchema = require("./friend_request.schema.server")();
    var FriendRequestModel = mongoose.model("FriendRequestModel", FriendRequestSchema);

    var api = {
        setModel: setModel,
        addFriendRequest: addFriendRequest,
        findAllRequestsForUser: findAllRequestsForUser,
        removeFriendRequest: removeFriendRequest,
        removeAllFriendRequestsForUser: removeAllFriendRequestsForUser,
        findRequestByUserRequester: findRequestByUserRequester
    };

    return api;

    function setModel(_model) {
        model = _model;
    }
    
    function addFriendRequest(userId, freq) {
        return FriendRequestModel
            .create(freq)
            .then(function (obj) {
                model.userModel
                    .addFriendRequest(userId, obj._id)
                    .then(function (obj1) {
                        return obj1;
                    })
            });
    }

    function findAllRequestsForUser(userId) {
        return model.userModel
            .findAllRequestsForUser(userId)
            .then(function (requests) {
                return requests;
            });
    }

    function findRequestByUserRequester(userId, requesterId) {
        return FriendRequestModel
            .findOne({user: userId, requestedUser: requesterId});
    }
    
    function removeFriendRequest(userId, requestId) {
        return FriendRequestModel
            .remove({_id: requestId})
            .then(function (status) {
                return model.userModel
                    .deleteFriendRequest(userId, requestId)
                    .then(function (res) {
                        console.log("Request deleted "+requestId);
                    })
            });
    }

    function removeAllFriendRequestsForUser(userId) {
        return FriendRequestModel
            .remove({user: userId})
            .then(function (status) {
                return model.userModel
                    .deleteFriendRequest(userId, requestId)
                    .then(function (res) {
                        console.log("Request deleted "+requestId);
                    })
            });
    }
};