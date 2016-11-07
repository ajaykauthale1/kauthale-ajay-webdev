/**
 * Created by Ajay on 10/31/2016.
 */
module.exports = function (app) {
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
        page._id = new Date().getTime()+"";
        page.websiteId = req.params.websiteId;
        pages.push(page);
        res.send(page);
        return;
    }
    
    function updatePage(req, res) {
        var newPage = req.body;
        var pageId = req.params['pageId'];
        for(var p in pages) {
            var page = pages[p];
            if(page._id === pageId) {
                pages[p] = newPage;
            }
        }

        res.send(200);
    }
    
    function deletePage(req, res) {
        var pageId = req.params['pageId'];
        for(var p in pages) {
            var page = pages[p];
            if(page._id === pageId) {
                pages.splice(p, 1);
            }
        }

        res.send(200);
    }
    
    function findAllPagesForWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var result = [];
        for(var p in pages) {
            var page = pages[p];
            if(page.websiteId === websiteId) {
                result.push(page);
            }
        }

        res.send(result);
    }

    function findPageById(req, res) {
        var pageId = req.params['pageId'];
        for(var p in pages) {
            var page = pages[p];
            if(page._id === pageId) {
                res.send(page);
                return;
            }
        }

        res.send("0");
    }
};
