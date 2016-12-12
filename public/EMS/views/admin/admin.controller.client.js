/**
 * Created by Ajay on 12/10/2016.
 */
(function () {
    angular
        .module("EMS")
        .controller("AdminController", AdminController);
    
    function AdminController($location, UserService, EventService) {
        var vm = this;
        vm.removeUser = removeUser;
        vm.logout = logout;
        vm.removeEvent = removeEvent;

        function init() {
            UserService
                .findCurrentUser()
                .success(function (currentUser) {
                    vm.user = currentUser;

                    UserService
                        .findAllUsers()
                        .success(function (users) {
                            vm.users = [];

                            for(var u in users) {
                                var user = users[u];
                                user.dateCreated = convertDate(user.dateCreated);
                                vm.users.push(user);
                            }

                            EventService
                                .findAllEvents()
                                .success(function (events) {
                                    vm.events = events;
                                })
                        });

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

        function removeUser(userId) {
            UserService
                .findFriendsForUserbyUserId(userId)
                .success(function (userObj) {
                    var arr = [];
                    for(var u in userObj.friends) {
                        arr.push(userObj.friends[u]._id);
                    }
                    UserService
                        .removeAllFriendsForUser(userId, arr)
                        .success(function () {
                            EventService
                                .removeAllEventsForUser(userId)
                                .success(function (status) {
                                    UserService
                                        .deleteUserOnly(userId)
                                        .success(function (status) {
                                           init();
                                        });
                                });
                        });
                });
        }

        function logout() {
            UserService.logout();
            $location.url("/login");
        }
    }
})();

function convertDate(date) {
    var date = new Date(date);
    var options = { day: 'numeric', year: 'numeric', month: 'long' };
    date = date.toLocaleDateString('en-US', options);
    return date;
}