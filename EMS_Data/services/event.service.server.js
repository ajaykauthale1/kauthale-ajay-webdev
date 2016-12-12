/**
 * Created by Ajay on 12/8/2016.
 */
module.exports = function (app, model) {
    var EVENT_CLIENT_ID = "FDMPDKOHUNMAQDNMRUWPJZ3VEA2NFZLWG6RBC2OJLBE2BO3SZW";
    var EVENT_CLIENT_SECRET = "XAPRKB6H6H7KV6FJCZTA";
    var EVENT_CALLBACK_URL = "http://127.0.0.1:3000/auth/eventbrite/callback";

    var passport      = require('passport');
    var multer = require('multer');
    var EventbriteStrategy = require('passport-eventbrite-oauth').OAuth2Strategy;
    var upload = multer({ dest: __dirname+'/../../public/EMS/uploads' });

    app.get('/auth/eventbrite', passport.authenticate('eventbrite'));
    app.get('/auth/eventbrite/callback',
        passport.authenticate('eventbrite', { failureRedirect: '/EMS/#/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/EMS/#/event');
        });

    app.post('/api/event/', createEvent);
    app.get('/api/userEvent/:userId', findAllEventsByUser);
    app.get('/api/event/:evtId', findEventById);
    app.get('/api/admin/events', findAllEventsForAdmin);
    app.put('/api/event/:userId', loggedInAndSelf, updateEvent);
    app.delete('/api/event/:evtId', deleteEvent);
    app.delete('/api/removeEventForUser/:userId', removeAllEventsForUser);
    app.post ("/api/eventUpload", upload.single('myFile'), uploadImage);
    app.post('/api/eventsForUsersInArray', findEventsForUsersInArray);
    app.post("/api/checkEvent/:evtId", checkEvent);
    app.put('/api/addAttendees/:evtId', addAttendees);
    app.delete('/api/removeAttendees/:evtId', removeAttendees);

    var eventConfig = {
        clientID     : EVENT_CLIENT_ID,
        clientSecret : EVENT_CLIENT_SECRET,
        callbackURL  : EVENT_CALLBACK_URL
    };
    passport.use(new EventbriteStrategy(eventConfig, eventStrategy));
    
    function eventStrategy(accessToken, refreshToken, profile, done) {
       //
        
    }

    function uploadImage(req, res) {
        var myFile = req.file;
        var filename = myFile.filename;     // new file name in uploads folder
        var path = myFile.path;         // full path of uploaded file
        var destination = myFile.destination;  // folder where file is saved to
        var size = myFile.size;
        var mimetype = myFile.mimetype;
        var evtId = req.body.evtId;
        var url = "/../EMS/uploads/" + filename;

        if (evtId != "" && evtId != null && evtId != undefined) {
            model.eventModel
                .updatePhoto(evtId, url)
                .then(function (updateObje) {
                    url = "/EMS/#/event/" + evtId;
                    res.redirect(url);
                });
            } else {
            var event = {creator: req.user._id};
            model.eventModel
                .createEvent(event)
                .then(function (newEvent) {
                    model.eventModel
                        .updatePhoto(newEvent._id, url)
                        .then(function (updateObje) {
                            url = "/EMS/#/event/" + newEvent._id;
                            res.redirect(url);
                        });
                });
        }
    }

    function loggedInAndSelf(req, res, next) {
        var loggedIn = req.isAuthenticated();
        var userId = req.params.userId;
        var self = userId == req.user._id;
        if(self && loggedIn) {
            next();
        } else {
            res.sendStatus(400).send("You are not the same person");
        }
    }

    function createEvent(req, res) {
        var event = req.body;
        model
            .eventModel
            .createEvent(event)
            .then(
                function (newevent) {
                    res.send(newevent);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
    
    function findAllEventsByUser(req, res) {
        model
            .eventModel
            .findAllEventsByUser(req.user._id)
            .then(function (events) {
                    res.send(events);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }
    
    function findEventById(req, res) {
        model
            .eventModel
            .findEventById(req.params.evtId)
            .then(
                function (event) {
                    if (event) {
                        res.send(event);
                    } else {
                        res.send(0);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
    
    function updateEvent(req, res) {
        var newEvent = req.body;
        var evtId = req.body._id;

        model
            .eventModel
            .updateEvent(evtId, newEvent)
            .then(
                function (status) {
                    res.send(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function deleteEvent(req, res) {
        model
            .eventModel
            .deleteEvent(req.params.evtId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function removeAllEventsForUser(req, res) {
        model
            .eventModel
            .removeAllEventsForUser(req.params.userId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
    
    function findEventsForUsersInArray(req, res) {
        model
            .eventModel
            .findEventsForUsersInArray(req.body)
            .then(function (events) {
                    res.json(events);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }
    
    function checkEvent(req, res) {
        model
            .eventModel
            .findEventById(req.params.evtId)
            .then(function (event) {
                if(event.creator.toString() == req.user._id.toString()) {
                    res.json(event);
                } else {
                    res.send('0');
                }
            },
            function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function addAttendees(req, res) {
        var evtId = req.params.evtId;
        model
            .eventModel
            .addAttendees(evtId, req.user._id)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
    
    function removeAttendees(req, res) {
        var evtId = req.params.evtId;
        model
            .eventModel
            .removeAttendees(evtId, req.user._id)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findAllEventsForAdmin(req, res) {
        model
            .eventModel
            .findAllEventsForAdmin()
            .then(function (events) {
                    res.send(events);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }
};