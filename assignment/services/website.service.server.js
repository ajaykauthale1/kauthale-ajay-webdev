/**
 * Created by Ajay on 10/31/2016.
 */
module.exports = function (app, model) {
    var websites = [
        { "_id": "123", "name": "Facebook",    "developerId": "456", "description": "lorem ipsum" },
        { "_id": "234", "name": "Tweeter",     "developerId": "456", "description": "lorem ipsum" },
        { "_id": "456", "name": "Gizmodo",     "developerId": "456", "description": "lorem ipsum" },
        { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "lorem ipsum" },
        { "_id": "678", "name": "Checkers",    "developerId": "123", "description": "lorem ipsum" },
        { "_id": "789", "name": "Chess",       "developerId": "234", "description": "lorem ipsum" }
    ];

    app.post('/api/user/:userId/website', createWebsite);
    app.put('/api/website/:websiteId', updateWebsite);
    app.delete('/api/website/:websiteId', deleteWebsite);
    app.get('/api/user/:userId/website', findAllWebsitesForUser);
    app.get('/api/website/:websiteId', findWebsiteById);

    function createWebsite(req, res) {
        var website = req.body;
        var userId = req.params.userId;
        model
            .websiteModel
            .createWebsiteForUser(userId, website)
            .then(function (websiteObj) {
                console.log(websiteObj);
                res.json(websiteObj);
            });
    }
    
    function updateWebsite(req, res) {
        var newWebsite = req.body;
        var websiteId = req.params['websiteId'];
        model.websiteModel
            .updateWebsite(websiteId, newWebsite)
            .then(function (websiteObj) {
                res.json(websiteObj);
            });
    }
    
    function deleteWebsite(req, res) {
        var websiteId = req.params['websiteId'];
        model.websiteModel
            .deleteWebsite(websiteId)
            .then(function (website) {
                res.send(200);
            });
    }
    
    function findAllWebsitesForUser(req, res) {
        var userId = req.params.userId;
           model.websiteModel
               .findAllWebsitesForUser(userId)
               .then(function (websites) {
                   res.json(websites);
               });
    }
    
    function findWebsiteById(req, res) {
        var websiteId = req.params['websiteId'];
        model.websiteModel
            .findWebsiteById(websiteId)
            .then(function (website) {
                res.json(website);
            });
    }
};

