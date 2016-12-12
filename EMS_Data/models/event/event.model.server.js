/**
 * Created by Ajay on 12/8/2016.
 */
module.exports = function () {
    var model = {};
    var mongoose = require("mongoose");
    var EventSchema = require("./event.schema.server")();
    var EventModel = mongoose.model("EventModel", EventSchema);

    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/EMS/uploads' });

    var api = {
        createEvent: createEvent,
        findAllEventsByUser: findAllEventsByUser,
        findEventById: findEventById,
        updateEvent: updateEvent,
        deleteEvent: deleteEvent,
        setModel: setModel,
        updatePhoto: updatePhoto,
        findEventsForUsersInArray: findEventsForUsersInArray,
        addAttendees: addAttendees,
        removeAttendees: removeAttendees,
        findAllEventsForAdmin: findAllEventsForAdmin,
        removeAllEventsForUser: removeAllEventsForUser
    };

    return api;

    function setModel(_model) {
        model = _model;
    }
    
    function createEvent(evt) {
        return EventModel.create(evt);
    }

    function findEventById(evtId) {
        return EventModel.findById(evtId);
    }

    function findAllEventsForAdmin() {
        return EventModel.find();
    }
    
    function findAllEventsByUser(userId) {
        return EventModel.find({creator: userId});
    }

    function updateEvent(evtId, newEvent) {
        return EventModel
            .update({_id: evtId},
                {
                    name: newEvent.name,
                    creator: newEvent.creator,
                    description: newEvent.description,
                    dateOfEvent: newEvent.dateOfEvent,
                    photoUrl: newEvent.photoUrl,
                    time: newEvent.time,
                    location: newEvent.location
                }
            );
    }

    function deleteEvent(evtId) {
        return EventModel
            .remove({_id: evtId});
    }

    function updatePhoto(evtId, url) {
        return EventModel
            .update({_id: evtId},
                {
                    photoUrl: url
                }
            );
    }
    
    function findEventsForUsersInArray(arrObj) {
        return EventModel
            .find({ creator: { $in: arrObj } });
    }
    
    function addAttendees(evtId, userId) {
        return EventModel.update({_id: evtId},{$push:{attendees: userId}});
    }
    
    function removeAttendees(evtId, userId) {
        return EventModel.update({_id: evtId},{$pull:{attendees: userId}});
    }

    function removeAllEventsForUser(userId) {
        return EventModel
            .remove({creator: userId});
    }
};