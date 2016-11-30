/**
 * Created by Ajay on 10/31/2016.
 */
module.exports = function (app, model) {
    var pages = [
        { "_id": "321", "name": "Post 1", "websiteId": "456", "title": "Title 1" },
        { "_id": "432", "name": "Post 2", "websiteId": "456", "title": "Title 2" },
        { "_id": "543", "name": "Post 3", "websiteId": "456", "title": "Title 3" }
    ];

    app.post('/api/website/:websiteId/page', createPage);
    app.put('/api/page/:pageId', updatePage);
    app.delete('/api/page/:pageId', deletePage);
    app.get('/api/website/:websiteId/page', findAllPagesForWebsite);
    app.get('/api/page/:pageId', findPageById);
    
    function createPage(req, res) {
        var page = req.body;
        var websiteId = req.params.websiteId;
        model
            .pageModel
            .createPage(websiteId, page)
            .then(function (pageObj) {
                res.json(pageObj);
            });
    }
    
    function updatePage(req, res) {
        var newPage = req.body;
        var pageId = req.params['pageId'];
        model.pageModel
            .updatePage(pageId, newPage)
            .then(function (pageObj) {
                res.json(pageObj);
            });
    }
    
    function deletePage(req, res) {
        var pageId = req.params['pageId'];
        model.pageModel
            .deletePage(pageId)
            .then(function (page) {
                res.send(200);
            });
    }
    
    function findAllPagesForWebsite(req, res) {
        var websiteId = req.params.websiteId;
        model.pageModel
            .findAllPagesForWebsite(websiteId)
            .then(function (pages) {
                res.json(pages);
            });
    }

    function findPageById(req, res) {
        var pageId = req.params['pageId'];
        model.pageModel
            .findPageById(pageId)
            .then(function (page) {
                res.json(page);
            });
    }
};
