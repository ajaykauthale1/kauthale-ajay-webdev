/**
 * Created by Ajay on 11/13/2016.
 */
module.exports = function () {
    var model = {};
    var mongoose = require("mongoose");
    var PageSchema = require("./page.schema.server")();
    var PageModel = mongoose.model("PageModel", PageSchema);

    var api = {
        setModel: setModel,
        createPage: createPage,
        findAllPagesForWebsite: findAllPagesForWebsite,
        findPageById: findPageById,
        updatePage: updatePage,
        deletePage: deletePage,
        addWidgetToPage: addWidgetToPage,
        deleteWidgetForPage: deleteWidgetForPage,
        findWidgetsForPage: findWidgetsForPage,
        reorderWidgetsForPage: reorderWidgetsForPage,
        findWidgetsIdsForPage:findWidgetsIdsForPage
    };

    return api;

    function setModel(_model) {
        model = _model;
    }

    function createPage(websiteId, page) {
        page._website = websiteId;
        return PageModel
            .create(page)
            .then(function (pageObj) {
                model.websiteModel
                    .addPageToWebsite(websiteId, pageObj._id)
                    .then(function (pages) {
                        console.log("Update Websites for user: "+ pages);
                        return pages;
                    });
            });
    }
    
    function findAllPagesForWebsite(websiteId) {
        return model.websiteModel
            .findPagesForWebsite(websiteId);
    }
    
    function findPageById(pageId) {
        return PageModel.findById(pageId);
    }

    function updatePage(pageId, page) {
        return PageModel
            .update({_id: pageId},
                {
                    name: page.name,
                    description: page.description,
                    title: page.title
                });
    }

    function deletePage(pageId) {
        var websiteId = PageModel.findById(pageId)._website;

        return PageModel.remove({_id: pageId})
            .then(function (res) {
                model.websiteModel.deletePageForWebsite(websiteId, pageId)
                    .then(function (pageObj) {
                        console.log("Page deleted and : "+pageObj);
                    })
            });
    }
    
    function addWidgetToPage(pageId, widgetId) {
        return PageModel.update({_id: pageId},{$push:{widgets: widgetId}});
    }

    function deleteWidgetForPage(pageId, widgetId) {
        return PageModel.update({_id: pageId},{$pull: {pages: widgetId}});
    }

    function findWidgetsForPage(pageId) {
        return PageModel.findById(pageId)
            .populate("widgets")
            .exec();
    }
    
    function reorderWidgetsForPage(pageId, newOrder) {
        return PageModel.update({_id: pageId},{widgets: newOrder});
    }

    function findWidgetsIdsForPage(pageId) {
        return PageModel.findById(pageId)
            .populate("widgets", "_id")
            .exec();
    }
};
