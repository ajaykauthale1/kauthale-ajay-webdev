/**
 * Created by Ajay on 12/8/2016.
 */
(function () {
    angular
        .module("EMS")
        .controller("EventController", EventController)
        .controller("EventListController", EventListController);

    function EventController($routeParams, $location, EventService, UserService) {
        var vm = this;
        var evtId = $routeParams['evtid'];

        vm.updateEvent = updateEvent;
        vm.removeEvent = removeEvent;
        vm.logout = logout;
        vm.addEventToUser = addEventToUser;
        vm.removeEventFromUser = removeEventFromUser;
        vm.createEvent = createEvent;

        function init() {
            UserService
                .findCurrentUser()
                .success(function (user) {
                    if(user != "0") {
                        vm.user = user;
                        vm.creatorLoggedIn = true;
                        if(vm.user.role == 'ADMIN') {
                            vm.isAdmin = true;
                        } else {
                            vm.isAdmin = false;
                        }

                        if(evtId != null && evtId != undefined) {
                            EventService
                                .findEventById(evtId)
                                .success(function (event) {
                                    vm.event = event;
                                    if(event.creator != user._id) {
                                        vm.creatorLoggedIn = false;
                                    }
                                    var userAttending = $.grep(event.attendees, function(e){ return e == vm.user._id });
                                    if(userAttending.length == 0) {
                                        vm.attending = false;
                                    } else {
                                        vm.attending = true;
                                    }
                                });
                        }

                    } else {
                        vm.error = "No such user";
                    }
                })
                .error(function () {

                });
        }

        init();

        function addEventToUser(evtId) {
            EventService
                .addEventToUser(vm.event._id)
                .success(function (status) {
                    init();
                })
        }

        function removeEventFromUser(evtId) {
            EventService
                .removeEventFromUser(vm.event)
                .success(function (status) {
                    init();
                })
        }
        
        function updateEvent(event) {
            event.time = $('#timepicker').val();
            event.creator = vm.user._id;
            event.location = $("#location").val();
            EventService
                .updateEvent(vm.user._id, event)
                .success(function (eventObj) {
                    vm.message = "Event has been updated.";
                })
                .error(function () {

                });
        }

        function createEvent(event) {
            event.time = $('#timepicker').val();
            event.creator = vm.user._id;
            event.location = $("#location").val();
            EventService
                .createEvent(event)
                .success(function (eventObj) {
                    $location.url("/event/"+eventObj._id);
                })
                .error(function () {

                });
        }

        function removeEvent(eventId) {
            EventService
                .deleteEvent(eventId)
                .success(function (event) {
                    vm.message = "Event is removed.";
                    init();
                })
                .error(function () {

                })
        }

        function logout() {
            UserService.logout();
            $location.url("/login");
        }
    }
    
    function EventListController($routeParams, $location, EventService, UserService) {
        var vm = this;
        vm.removeEvent = removeEvent;
        vm.logout = logout;

        function init() {
            UserService
                .findCurrentUser()
                .success(function (user) {
                    if(user != "0") {
                        vm.user = user;
                            EventService
                                .findAllEventsByUser(vm.user._id)
                                .success(function (events) {
                                    vm.events = events;
                                });

                    } else {
                        vm.error = "No such user";
                    }
                })
                .error(function () {

                });
        }

        init();

        function removeEvent(eventId) {
            EventService
                .deleteEvent(eventId)
                .success(function (event) {
                    vm.message = "Event is removed.";
                    init();
                })
                .error(function () {

                })
        }

        function logout() {
            UserService.logout();
            $location.url("/login");
        }
    }

})();