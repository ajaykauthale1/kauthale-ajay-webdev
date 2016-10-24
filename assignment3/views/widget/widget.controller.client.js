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
        vm.widgets = WidgetService.findWidgetsByPageId(pageId);
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
        vm.widget = WidgetService.findWidgetById(vm.widgetId);

        function updateWidget(widget) {
            WidgetService.updateWidget(vm.widgetId, widget);
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
        }

        function deleteWidget() {
            WidgetService.deleteWidget(vm.widgetId);
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
        }
    }

    function NewWidgetController($location, $routeParams, WidgetService) {
        var vm = this;
        vm.websiteId = $routeParams['wid'];
        vm.createWidget = createWidget;
        vm.createHeader = createHeader;
        vm.createImage = createImage;
        vm.createYouTube = createYouTube;
        vm.pageId = $routeParams['pid'];
        vm.userId = $routeParams['uid'];
        vm.widgets = WidgetService.findWidgetsByPageId(vm.pageId);

        function createWidget(widget) {
            var id = WidgetService.createWidget(vm.pageId, widget);
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pageId);
            return id;
        }
        
        function createHeader() {
            var widget = {"_id": "", "widgetType": "HEADER", "pageId": "", "size": 3, "text": ""};
            var id = createWidget(widget);
            vm.widget = widget;
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+id);
        }

        function createImage() {
            var widget = {"_id": "", "widgetType": "IMAGE", "pageId": "", "width": "", "url": ""}
            var id = createWidget(widget);
            vm.widget = widget;
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+id);
        }

        function createYouTube() {
            var widget = { "_id": "", "widgetType": "YOUTUBE", "pageId": "", "width": "", "url": "" };
            var id = createWidget(widget);
            vm.widget = widget;
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+id);
        }
    }
})();