/**
 * Created by Ajay on 10/11/2016.
 */
(function () {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);

    function WebsiteService() {
        var websites = [
            { "_id": "123", "name": "Facebook",    "developerId": "456", "description": "lorem ipsum" },
            { "_id": "234", "name": "Tweeter",     "developerId": "456", "description": "lorem ipsum" },
            { "_id": "456", "name": "Gizmodo",     "developerId": "456", "description": "lorem ipsum" },
            { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "lorem ipsum" },
            { "_id": "678", "name": "Checkers",    "developerId": "123", "description": "lorem ipsum" },
            { "_id": "789", "name": "Chess",       "developerId": "234", "description": "lorem ipsum" }
        ];

        var api = {
            createWebsite   : createWebsite,
            findWebsitesByUser : findWebsitesByUser,
            findWebsiteById : findWebsiteById,
            updateWebsite : updateWebsite,
            deleteWebsite : deleteWebsite
        };

        return api;
        
        function createWebsite(userId, website) {
            website._id = ""+new Date();
            website.developerId = userId;
            websites.push(websites.length, website);
        }

        function findWebsitesByUser(userId) {
            var result = [];
            for(var w in websites) {
                var website = websites[w];
                if(website.developerId   === userId) {
                    result.push(website);
                }
            }
            return result;
        }

        function findWebsiteById(websiteId) {
            for(var w in websites) {
                var website = websites[w];
                if(website._id   === websiteId) {
                    return website;
                }
            }
            return null;
        }

        function updateWebsite(websiteId, website) {
            var index = 0;
            for(var w in websites) {
                var website = websites[w];
                if(website._id   === websiteId) {
                    break;
                }
                index = index + 1;
            }
            websites[index] = website;
        }

        function deleteWebsite(websiteId) {
            var index = 0;
            for(var w in websites) {
                var website = websites[w];
                if(website._id   === websiteId) {
                    break;
                }
                index = index + 1;
            }
            websites.splice(index, 1);
        }
    }
})();