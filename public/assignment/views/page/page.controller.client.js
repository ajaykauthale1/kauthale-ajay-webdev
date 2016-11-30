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
        PageService.findPageByWebsiteId(websiteId)
            .success(function (website) {
                vm.pages = website.pages;
            });
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
        PageService.findPageById(vm.pageId)
            .success(function (page) {
               vm.page = page;
            });

        function updatePage(page) {
            PageService.updatePage(vm.pageId, page)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                });
        }

        function deletePage() {
            PageService.deletePage(vm.pageId)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                });
        }
    }
    
    function NewPageController($location, $routeParams, PageService) {
        var vm = this;
        vm.websiteId = $routeParams['wid'];
        vm.createPage = createPage;
        vm.pageId = $routeParams['pid'];
        vm.userId = $routeParams['uid'];
        PageService.findPageByWebsiteId(vm.websiteId)
            .success(function (website) {
                vm.pages = website.pages;
            });

        function createPage(page) {
            PageService.createPage(vm.websiteId, page)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                });
        }
    }
})();