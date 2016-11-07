/**
 * Created by Ajay on 10/31/2016.
 */
module.exports = function (app) {
    var widgets = [
        { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "http://lorempixel.com/400/200/"},
        { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
        { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://youtu.be/AM2Ivdi9c4E" },
        { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
    ];

    app.post('/api/page/:pageId/widget', createWidget);
    app.put('/api/widget/:widgetId', updateWidget);
    app.delete('/api/widget/:widgetId', deleteWidget);
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/:widgetId', findWidgetById);
    app.put('/page/:pageId/widget', updateWidgets);

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/assignment/uploads' });


    app.post ("/api/uploads", upload.single('myFile'), uploadImage);


    function uploadImage(req, res) {
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;
        var pageId        = req.body.pageId;
        var userId        = req.body.userId;
        var websiteId     = req.body.websiteId;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in uploads folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        var newWidget = { "_id": widgetId, "widgetType": "IMAGE", "pageId": pageId, "width": width,
            "url": "/../assignment/uploads/"+filename, "name": req.body.name,
            "text": req.body.text};
        for(var w in widgets) {
            var widget = widgets[w];
            if(widget._id === widgetId) {
                widgets[w] = newWidget;
            }
        }

        var url = "/assignment/index.html#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/"+widgetId;
        res.redirect(url);
    }

    function createWidget(req, res) {
        var widget = req.body;
        widget._id = new Date().getTime()+"";
        widget.pageId = req.params.pageId;
        widgets.push(widget);
        res.send(widget);
        return;
    }

    function updateWidget(req, res) {
        var newWidget = req.body;
        var widgetId = req.params['widgetId'];
        for(var w in widgets) {
            var widget = widgets[w];
            if(widget._id === widgetId) {
                widgets[w] = newWidget;
            }
        }

        res.send(200);
    }

    function deleteWidget(req, res) {
        var widgetId = req.params['widgetId'];
        for(var w in widgets) {
            var widget = widgets[w];
            if(widget._id === widgetId) {
                widgets.splice(w, 1);
            }
        }

        res.send(200);
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;
        var result = [];
        for(var w in widgets) {
            var widget = widgets[w];
            if(widget.pageId === pageId) {
                result.push(widget);
            }
        }
        res.send(result);
    }

    function findWidgetById(req, res) {
        var widgetId = req.params['widgetId'];
        for(var w in widgets) {
            var widget = widgets[w];
            if(widget._id === widgetId) {
                res.send(widget);
                return;
            }
        }

        res.send("0");
    }
    
    function updateWidgets(req, res) {
        var start = req.query.initial;
        var end = req.query.final;
        widgets.splice(end, 0, widgets.splice(start, 1)[0]);
    }
};