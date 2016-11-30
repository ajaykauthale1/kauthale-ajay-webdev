/**
 * Created by Ajay on 11/13/2016.
 */
module.exports = function () {
    var model = {};
    var mongoose = require("mongoose");
    var WidgetSchema = require("./widget.schema.server")();
    var WidgetModel = mongoose.model("WidgetModel", WidgetSchema);

    var api = {
        setModel: setModel,
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget,
        reorderWidget: reorderWidget
    };

    return api;

    function setModel(_model) {
        model = _model;
    }

    function createWidget(pageId, widget) {
        widget._page = pageId;
        return  WidgetModel
            .create(widget);
    }

    function findAllWidgetsForPage(pageId) {
        return model.pageModel
            .findWidgetsForPage(pageId);
    }
    
    function findWidgetById(widgetId) {
        return WidgetModel.findById(widgetId);
    }
    
    function updateWidget(widgetId, widget) {
        if(widget.size == undefined) {
            widget.size = 0;
        }
        if(widget.rows == undefined) {
            widget.rows = 0;
        }
        return WidgetModel
            .update({_id: widgetId},
                {
                    name: widget.name,
                    description: widget.description,
                    text: widget.text,
                    url: widget.url,
                    width: widget.width,
                    height: widget.height,
                    size: widget.size,
                    rows: widget.rows,
                    placeholder: widget.placeholder,
                    formatted: widget.formatted
                });
    }

    function deleteWidget(widgetId) {
        var pageId = WidgetModel.findById(widgetId)._page;

        return WidgetModel.remove({_id: widgetId})
            .then(function (res) {
                model.pageModel.deleteWidgetForPage(pageId, widgetId)
                    .then(function (widgetObj) {
                        console.log("Widget deleted and : "+widgetObj);
                    })
            });
    }

    function reorderWidget(pageId, start, end) {
       return model.pageModel.findWidgetsIdsForPage(pageId)
            .then(function (page) {
                var widgets = page.widgets;
                widgets.splice(end, 0, widgets.splice(start, 1)[0]);
                model.pageModel.reorderWidgetsForPage(pageId, widgets)
                    .then(function (page) {
                       console.log("widgets reordered");
                    });
            });
    }
};