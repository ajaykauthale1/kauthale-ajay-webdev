/**
 * Created by Ajay on 10/11/2016.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("EditWebsiteController", EditWebsiteController)
        .controller("NewWebsiteController", NewWebsiteController);
    
    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        var userId = $routeParams['uid'];
        vm.userId = userId;
        var promise = WebsiteService.findWebsitesByUser(userId);
        promise
            .success(function (user) {
                vm.websites = user.websites;
            });
    }

    function EditWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;
        vm.websiteId = $routeParams['wid'];
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;
        var userId = $routeParams['uid'];
        vm.userId = userId;
        WebsiteService.findWebsitesByUser(vm.userId)
            .success(function (user) {
                vm.websites = user.websites;
            });

        WebsiteService.findWebsiteById(vm.websiteId)
            .success(function (website) {
            vm.website = website;
        });


        function updateWebsite(website) {
            if(website == undefined || website.name == undefined || website.name == "") {
                vm.error = true;
                return;
            }
            WebsiteService.updateWebsite(vm.websiteId, website)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/");
                });
        }

        function deleteWebsite() {
            WebsiteService.deleteWebsite(vm.websiteId)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website");
                });
        }
    }

    function NewWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;
        vm.websiteId = $routeParams['wid'];
        vm.createWebsite = createWebsite;
        vm.userId = $routeParams['uid'];
        var promise = WebsiteService.findWebsitesByUser(vm.userId);
        promise
            .success(function (user) {
                vm.websites = user.websites;
            });

        function createWebsite(website) {
            if(website == undefined || website.name == undefined || website.name == "") {
                vm.error = true;
                return;
            }

            WebsiteService.createWebsite(vm.userId, website)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website");
                });
        }
    }
})();