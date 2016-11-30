/**
 * Created by Ajay on 10/11/2016.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    function WidgetListController($routeParams, WidgetService, $sce) {
        var vm = this;
        var pageId = $routeParams['pid'];
        WidgetService.findWidgetsByPageId(pageId)
            .success(function (page) {
                vm.widgets = page.widgets;
            });
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];
        vm.checkSafeHtml = checkSafeHtml;
        vm.checkSafeYouTubeUrl = checkSafeYouTubeUrl;

        function checkSafeHtml(html) {
            return $sce.trustAsHtml(html);
        }
        
        function checkSafeYouTubeUrl(url) {
            var parts = url.split('/');
            var id = parts[parts.length - 1];
            url = "https://www.youtube.com/embed/" + id;
            return $sce.trustAsResourceUrl(url);
        }
    }

    function EditWidgetController($location, $routeParams, WidgetService) {
        var vm = this;
        vm.websiteId = $routeParams['wid'];
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;
        vm.pageId = $routeParams['pid'];
        vm.userId = $routeParams['uid'];
        vm.widgetId = $routeParams['wgid'];
        WidgetService.findWidgetById(vm.widgetId)
            .success(function (w) {
                vm.widget = w;
            });

        function updateWidget(widget) {
            WidgetService.updateWidget(vm.widgetId, widget)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
                });
        }

        function deleteWidget() {
            WidgetService.deleteWidget(vm.widgetId)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
                });
        }
    }

    function NewWidgetController($location, $routeParams, WidgetService) {
        var vm = this;
        vm.websiteId = $routeParams['wid'];
        vm.createWidget = createWidget;
        vm.createHeader = createHeader;
        vm.createImage = createImage;
        vm.createYouTube = createYouTube;
        vm.createHTML = createHTML;
        vm.createTEXT = createTEXT;
        vm.pageId = $routeParams['pid'];
        vm.userId = $routeParams['uid'];

        WidgetService.findWidgetsByPageId(vm.pageId)
            .success(function (page) {
                vm.widgets = page.widgets;
            });

        function createWidget(widget) {
            WidgetService.createWidget(vm.pageId, widget)
                .success(function (wd) {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+wd._id);
                });
        }
        
        function createHeader() {
            var widget = {"widgetType": "HEADER"};
            vm.widget = createWidget(widget);
        }

        function createImage() {
            var widget = {"widgetType": "IMAGE"};
            vm.widget = createWidget(widget);
        }

        function createYouTube() {
            var widget = {"widgetType": "YOUTUBE"};
            vm.widget = createWidget(widget);
        }

        function createHTML() {
            var widget = {"widgetType": "HTML"};
            vm.widget = createWidget(widget);
        }

        function createTEXT() {
            var widget = {"widgetType": "INPUT"};
            vm.widget = createWidget(widget);
        }
    }
})();