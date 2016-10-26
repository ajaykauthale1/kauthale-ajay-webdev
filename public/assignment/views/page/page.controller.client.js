/**
 * Created by Ajay on 10/11/2016.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("EditPageController", EditPageController)
        .controller("NewPageController", NewPageController);;

    function PageListController($location, $routeParams, PageService) {
        var vm = this;
        var websiteId = $routeParams['wid'];
        vm.pages = PageService.findPageByWebsiteId(websiteId);
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
    }

    function EditPageController($location, $routeParams, PageService) {
        var vm = this;
        vm.websiteId = $routeParams['wid'];
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;
        vm.pageId = $routeParams['pid'];
        var userId = $routeParams['uid'];
        vm.userId = userId;
        var page = PageService.findPageById(vm.pageId);

        function updatePage(page) {
            PageService.updatePage(vm.pageId, page);
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
        }

        function deletePage() {
            PageService.deletePage(vm.pageId);
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
        }

        vm.page = page;
    }
    
    function NewPageController($location, $routeParams, PageService) {
        var vm = this;
        vm.websiteId = $routeParams['wid'];
        vm.createPage = createPage;
        vm.pageId = $routeParams['pid'];
        vm.userId = $routeParams['uid'];
        vm.pages = PageService.findPageByWebsiteId(vm.websiteId);

        function createPage(page) {
            PageService.createPage(vm.websiteId, page);
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
        }
    }
})();