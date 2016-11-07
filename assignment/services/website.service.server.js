/**
 * Created by Ajay on 10/31/2016.
 */
module.exports = function (app) {
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
        website._id = new Date().getTime()+"";
        website.developerId = req.params.userId;
        websites.push(website);
        res.send(website);
        return;
    }
    
    function updateWebsite(req, res) {
        var newWebsite = req.body;
        var websiteId = req.params['websiteId'];
        for(var w in websites) {
            var webiste = websites[w];
            if(webiste._id === websiteId) {
                websites[w] = newWebsite;
            }
        }

        res.send(200);
    }
    
    function deleteWebsite(req, res) {
        var websiteId = req.params['websiteId'];
        for(var w in websites) {
            var webiste = websites[w];
            if(webiste._id === websiteId) {
                websites.splice(w, 1);
            }
        }

        res.send(200);
    }
    
    function findAllWebsitesForUser(req, res) {
        var userId = req.params.userId;
        var result = [];
        for(var w in websites) {
            var website = websites[w];
            if(website.developerId   === userId) {
                result.push(website);
            }
        }
        res.send(result);
    }
    
    function findWebsiteById(req, res) {
        var websiteId = req.params['websiteId'];
        for(var w in websites) {
            var website = websites[w];
            if(website._id   === websiteId) {
                res.send(website);
                return;
            }
        }

        res.send("0");
    }
};

