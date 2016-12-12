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
        findWebsitesForUser: findWebsitesForUser,
        setModel: setModel,
        addWebsiteToUser: addWebsiteToUser,
        deleteWebsiteForUser: deleteWebsiteForUser
    };
    return api;


    function setModel(_model) {
        model = _model;
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
                    email: user.email
                }
            );
    }

    function deleteUser(userId) {
        return UserModel.remove({_id: userId});
    }

    function findWebsitesForUser(userId) {
        return UserModel.findById(userId)
            .populate("websites", "name")
            .exec();
    }

    function addWebsiteToUser(userId, websiteId) {
        return UserModel.update({_id: userId},{$push:{websites: websiteId}});
    }
    
    function deleteWebsiteForUser(userId, websiteId) {
        return UserModel.update({_id: userId},{$pull: {websites: websiteId}});
    }

};