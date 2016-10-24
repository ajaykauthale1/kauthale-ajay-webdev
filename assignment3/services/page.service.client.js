/**
 * Created by Ajay on 10/11/2016.
 */
(function () {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService() {
        var pages = [
                { "_id": "321", "name": "Post 1", "websiteId": "456", "title": "Title 1" },
                { "_id": "432", "name": "Post 2", "websiteId": "456", "title": "Title 2" },
                { "_id": "543", "name": "Post 3", "websiteId": "456", "title": "Title 3" }
            ];

        var api = {
            createPage   : createPage,
            findPageByWebsiteId : findPageByWebsiteId,
            findPageById : findPageById,
            updatePage : updatePage,
            deletePage : deletePage
        };

        return api;
        
        function createPage(websiteId, page) {
            page._id = ""+new Date();
            page.websiteId = websiteId;
            pages.push(pages.length, page);
        }

        function findPageByWebsiteId(websiteId) {
            var result = [];
            for(var p in pages) {
                var page = pages[p];
                if(page.websiteId   === websiteId) {
                    result.push(page);
                }
            }
            return result;
        }

        function findPageById(pageId) {
            for(var p in pages) {
                var page = pages[p];
                if(page._id   === pageId) {
                    return page;
                }
            }

            return null;
        }

        function updatePage(pageId, page) {
            var index = 0;
            for(var p in pages) {
                var page = pages[p];
                if(page._id   === pageId) {
                    break;
                }
                index = index + 1;
            }
            pages[index] = page;
        }

        function deletePage(pageId) {
            var index = 0;
            for(var p in pages) {
                var page = pages[p];
                if(page._id   === pageId) {
                    break;
                }
                index = index + 1;
            }
            pages.splice(index, 1);
        }
    }
})();