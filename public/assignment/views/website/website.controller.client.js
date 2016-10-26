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
        vm.websites = WebsiteService.findWebsitesByUser(userId);
        vm.userId = userId;
    }

    function EditWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;
        vm.websiteId = $routeParams['wid'];
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;
        var userId = $routeParams['uid'];
        vm.userId = userId;
        vm.websites = WebsiteService.findWebsitesByUser(userId);
        vm.website = WebsiteService.findWebsiteById(vm.websiteId);

        function updateWebsite(website) {
            WebsiteService.updateWebsite(vm.websiteId, website);
            $location.url("/user/"+vm.userId+"/website");
        }

        function deleteWebsite() {
            WebsiteService.deleteWebsite(vm.websiteId);
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
            $location.url("/user/"+vm.userId+"/website");
        }
    }

    function NewWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;
        vm.websiteId = $routeParams['wid'];
        vm.createWebsite = createWebsite;
        vm.userId = $routeParams['uid'];;
        vm.websites = WebsiteService.findWebsitesByUser(vm.userId);

        function createWebsite(website) {
            WebsiteService.createWebsite(vm.userId, website);
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
            $location.url("/user/"+vm.userId+"/website");
        }
    }
})();