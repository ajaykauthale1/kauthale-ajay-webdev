module.exports = function () {

    var model = {};
    var mongoose = require("mongoose");
    var WebsiteSchema = require("./website.schema.server")();
    var WebsiteModel = mongoose.model("WebsiteModel", WebsiteSchema);

    var api = {
        setModel: setModel,
        createWebsiteForUser: createWebsiteForUser,
        findWebsiteById: findWebsiteById,
        findAllWebsitesForUser: findAllWebsitesForUser,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite,
        addPageToWebsite: addPageToWebsite,
        deletePageForWebsite: deletePageForWebsite,
        findPagesForWebsite:findPagesForWebsite
    };

    return api;

    function setModel(_model) {
        model = _model;
    }

    function createWebsiteForUser(userId, website){
        website.dateCreated = new Date();
        website._user = userId;
        return WebsiteModel
            .create(website)
            .then(function (websiteObj) {
                model.userModel
                    .addWebsiteToUser(userId, websiteObj._id)
                    .then(function (websites) {
                        console.log("Update Websites for user: "+ websites);
                        return websites;
                    });
            });
    }

    function findAllWebsitesForUser(userId) {
        return model.userModel
            .findWebsitesForUser(userId);
    }

    function findWebsiteById(websiteId) {
        return WebsiteModel.findById(websiteId);
    }

    function updateWebsite(websiteId, website) {
        return WebsiteModel
            .update({_id: websiteId},
            {
                name: website.name,
                description: website.description
            });
    }

    function deleteWebsite(websiteId) {
        var userId = WebsiteModel.findById(websiteId)._user;

        return WebsiteModel.remove({_id: websiteId})
            .then(function (res) {
                model.userModel.deleteWebsiteForUser(userId, websiteId)
                    .then(function (userObj) {
                        console.log("Website deleted and : "+userObj);
                    })
            });
    }


    function addPageToWebsite(websiteId, pageId) {
        return WebsiteModel.update({_id: websiteId},{$push:{pages: pageId}});
    }

    function deletePageForWebsite(websiteId, pageId) {
        return WebsiteModel.update({_id: websiteId},{$pull: {pages: pageId}});
    }
    
    function findPagesForWebsite(websiteId) {
        return WebsiteModel.findById(websiteId)
            .populate("pages", "name")
            .exec();
    }
};