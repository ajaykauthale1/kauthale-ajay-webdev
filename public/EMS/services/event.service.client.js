/**
 * Created by Ajay on 12/8/2016.
 */
/**
 * Created by Ajay on 10/11/2016.
 */
(function () {
    angular
        .module("EMS")
        .factory("EventService", EventService);

    function EventService($http) {

        var api = {
            createEvent: createEvent,
            findAllEventsByUser: findAllEventsByUser,
            findEventById: findEventById,
            updateEvent: updateEvent,
            deleteEvent: deleteEvent,
            logout: logout,
            findEventsForUsersInArray: findEventsForUsersInArray,
            checkEvent: checkEvent,
            addEventToUser: addEventToUser,
            removeEventFromUser: removeEventFromUser,
            findAllEvents: findAllEvents,
            removeAllEventsForUser: removeAllEventsForUser
        };

        return api;

        function logout() {
            $http.post("/api/logout");
        }

        function createEvent(event) {
            return $http.post("/api/event/", event);
        }

        function findEventById(eventId) {
            var url = "/api/event/" + eventId;
            return $http.get(url);
        }
        
        function findAllEventsByUser(userId) {
            var url = "/api/userEvent/" + userId;
            return $http.get(url);
        }

        function updateEvent(userId, event) {
            var url = "/api/event/" + userId;
            return $http.put(url, event);
        }

        function deleteEvent(evtId) {
            var url = "/api/event/" + evtId;
            return $http.delete(url);
        }

        function findEventsForUsersInArray(users) {
            var url = "/api/eventsForUsersInArray";
            return $http.post(url, users);
        }
        
        function checkEvent(evtId) {
            return $http.post("/api/checkEvent/"+evtId);
        }

        function addEventToUser(evtId) {
            var url = "/api/addAttendees/" + evtId;
            return $http.put(url);
        }
        
        function removeEventFromUser(evtId) {
            var url = "/api/removeAttendees/" + evtId;
            return $http.delete(url);
        }

        function removeAllEventsForUser(userId) {
            var url = "/api/removeEventForUser/" + userId;
            return $http.delete(url);
        }

        function findAllEvents() {
            var url = "/api/admin/events";
            return $http.get(url);
        }
    }
})();