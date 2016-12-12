/**
 * Created by Ajay on 12/7/2016.
 */
module.exports = function () {
    var model = {};
    var mongoose = require("mongoose");
    var ConnectionSchema = require("./friend_connection.schema.server")();
    var ConnectionModel = mongoose.model("ConnectionModel", ConnectionSchema);

    var api = {
        setModel: setModel,
        addConnection: addConnection,
        findConnection:findConnection,
        findConnectionForFriend:findConnectionForFriend,
        findAllConnectionForUser: findAllConnectionForUser,
        removeFriendConnection: removeFriendConnection,
        removeAllConnectionsForUser: removeAllConnectionsForUser
    };

    return api;

    function setModel(_model) {
        model = _model;
    }
    
    function addConnection(connection) {
        return ConnectionModel
            .create(connection)
            .then(function (connectionObj) {
                model.userModel
                    .addFriend(connectionObj.firstUser, connectionObj.secondUser)
                    .then(function (obj) {
                        model.userModel
                            .addFriend(connectionObj.secondUser, connectionObj.firstUser)
                            .then(function (obj1) {
                                return obj1;
                            });
                    });
            });
    }

    function findConnection(userId) {
        return ConnectionModel.find({"firstUser": userId});
    }
    
    function findConnectionForFriend(userId) {
        return ConnectionModel.find({"secondUser": userId});
    }
    
    function findAllConnectionForUser(userId) {
        return ConnectionModel
            .find({ "$or": [{
                "firstUser": userId
            }, {
                "secondUser": userId
            }]});
    }
    
    function removeAllConnectionsForUser() {
        return ConnectionModel
            .remove({ "$or": [{
                "firstUser": userId
            }, {
                "secondUser": userId
            }]});
    }

    function removeFriendConnection(userId, friendId) {
        return ConnectionModel
            .findOneAndRemove({ "$and": [{
                "firstUser": friendId
            }, {
                "secondUser": userId
            }]})
            .then(function (status) {
                ConnectionModel
                    .findOneAndRemove({ "$and": [{
                        "firstUser": userId
                    }, {
                        "secondUser": friendId
                    }]})
                    .then(function (obj) {
                        return model.userModel.deleteFriendForUser(userId, friendId)
                            .then(function (userObj) {
                                return model.userModel.deleteFriendForUser(friendId, userId)
                                    .then(function (userObj1) {
                                        console.log("friend deleted and : "+userObj1);
                                    })
                            })
                    })
            });
    }
};