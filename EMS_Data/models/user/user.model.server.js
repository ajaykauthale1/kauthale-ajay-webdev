module.exports = function () {
    var model = {};
    var mongoose = require("mongoose");
    var UserSchema = require("./user.schema.server")();
    var UserModel = mongoose.model("UserModel", UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByGoogleId: findUserByGoogleId,
        findUserByFacebookId: findUserByFacebookId,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser,
        setModel: setModel,
        updatePhoto: updatePhoto,
        findAllUsers: findAllUsers,
        addFriend: addFriend,
        findFriendsForUser: findFriendsForUser,
        deleteFriendForUser: deleteFriendForUser,
        addFriendRequest: addFriendRequest,
        findAllRequestsForUser: findAllRequestsForUser,
        deleteFriendRequest:deleteFriendRequest,
        deleteAllFriendRequest: deleteAllFriendRequest,
        findUsersInArray: findUsersInArray,
        findAllUsersForAdmin: findAllUsersForAdmin,
        pullFriends: pullFriends,
        deleteUserOnly: deleteUserOnly
    };
    return api;


    function setModel(_model) {
        model = _model;
    }
    
    function findAllUsers(username) {
       return UserModel
            .find({"username": {$regex: username, $options: 'i'}});
    }

    function findAllUsersForAdmin() {
        return UserModel.find({role: {$ne: 'ADMIN'}});
    }
    
    function findUsersInArray(arrObj) {
        return UserModel
            .find({ _id: { $in: arrObj } });
    }

    function findUserByGoogleId(googleId) {
        return UserModel
            .findOne({"google.id": googleId});
    }

    function findUserByFacebookId(facebookId) {
        return UserModel
            .findOne({"facebook.id": facebookId});
    }

    function createUser(user) {
        return UserModel.create(user);
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function findUserByCredentials(username, password) {
        return UserModel.findOne({username: username,password: password});
    }

    function findUserByUsername(username) {
        return UserModel.findOne({username: username});
    }

    function updateUser(userId, user) {
        return UserModel
            .update({_id: userId},
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    occupation: user.occupation,
                    username: user.username,
                    password: user.password,
                    phone: user.phone,
                    facebook: user.facebook
                    /*role: user.role*/
                }
            );
    }

    function updatePhoto(userId, url) {
        return UserModel
            .update({_id: userId},
                {
                    photoUrl: url
                }
            );
    }

    function deleteUser(userId) {
        return UserModel
            .remove({_id: userId})
            .then(function (status) {
                return model.connectionModel
                    .removeAllConnectionsForUser(userId)
                    .then(function (status) {
                        console.log("Connections Removed");
                    })
            });
    }

    function deleteUserOnly(userId) {
        return UserModel.remove({_id: userId});
    }

    function addFriend(userId, newFriendId) {
        return UserModel.update({_id: userId},{$push:{friends: newFriendId}});
    }

    function findFriendsForUser(userId) {
        return UserModel.findById(userId)
            .populate("friends")
            .exec();
    }

    function findAllRequestsForUser(userId) {
        return UserModel.findById(userId)
            .populate("friendRequests")
            .exec();
    }

    function deleteFriendForUser(userId, friendId) {
        return UserModel.update({_id: userId},{$pull: {friends: friendId}});
    }

    function pullFriends(userId, arr) {
        return UserModel.update({_id: {$in : arr}},{$pull: {friends: userId}});
    }

    function deleteFriendRequest(userId, requestId) {
        return UserModel.update({_id: userId},{$pull: {friendRequests: requestId}});
    }

    function deleteAllFriendRequest(userId) {
        return UserModel.update({_id: userId},{friendRequests: []});
    }
    
    function addFriendRequest(userId, newFriendId) {
        return UserModel.update({_id: userId},{$push:{friendRequests: newFriendId}});
    }
};