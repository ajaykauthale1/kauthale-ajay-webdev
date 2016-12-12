/**
 * Created by Ajay on 10/11/2016.
 */
(function () {
    angular
        .module("EMS")
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController)
        .controller("RegisterController", RegisterController)
        .controller("LiveFeedController", LiveFeedController)
        .controller("FriendListController", FriendListController)
        .controller("FriendRequestController", FriendRequestController);
    
    function LoginController($location, UserService) {
        var vm = this;
        vm.login = function (username, password) {
            //UserService.findUserByCredentials(username, password)
            var promise = UserService.login(username, password);
               promise
                    .success(function (user) {
                    if(user ==  "0") {
                        vm.error = "No such user";
                    } else {
                        if(user.role != 'ADMIN') {
                            $location.url("/user_live/"+user._id);
                        } else {
                            $location.url("/admin");
                        }
                    }
                })
                .error(function () {

                })
        }
    }

    function LiveFeedController($location, $routeParams, UserService, EventService) {
        var vm = this;
        vm.logout = logout;
        vm.edit = edit;
        vm.addEventToUser = addEventToUser;
        vm.removeEventFromUser = removeEventFromUser;

        function init() {
            UserService
                .findCurrentUser()
                .success(function (user) {
                    if(user != "0") {
                        vm.user = user;
                        UserService
                            .findFriendsForUser()
                            .success(function (userObj) {
                                vm.user = userObj;
                                var friends = vm.user.friends;
                                var friendIds = [];
                                var friendsList = [];
                                for (var u in friends) {
                                    var f =
                                    {
                                        _id: friends[u]._id,
                                        firstName: friends[u].firstName,
                                        lastName: friends[u].lastName,
                                        photoUrl: friends[u].photoUrl
                                    };
                                    friendsList.push(f);
                                    friendIds.push(friends[u]._id);
                                }
                                vm.friendsList = friendsList;

                                EventService
                                    .findEventsForUsersInArray(friendIds) 
                                    .success(function (events) {
                                        vm.events = events;
                                        var finalEvents = [];
                                        for(var e in events) {
                                            var event = events[e];
                                            event.creator = $.grep(vm.friendsList, function(e){ return e._id == event.creator; });
                                            var userAttending = $.grep(event.attendees, function(e){ return e == vm.user._id });
                                            if(userAttending.length == 0) {
                                                event.attending = false;
                                            } else {
                                                event.attending = true;
                                            }
                                            event.dateCreated = convertDate(event.dateCreated);
                                            finalEvents.push(event);
                                        }

                                        vm.events = finalEvents;
                                    })

                            });
                    }
                })
                .error(function () {

                })
        }

        init();

        function logout() {
            UserService.logout();
            $location.url("/login");
        }

        function edit() {
            UserService
                .findCurrentUser()
                .success(function (user) {
                    if(user != "0") {
                        vm.user = user;
                        $location.url("/user/"+user._id);
                    }
                })
                .error(function () {

                })
        }

        function findFriends() {
            $location.url("/user_friends");
        }

        function addEventToUser(evtId) {
            EventService
                .addEventToUser(evtId)
                .success(function (status) {
                    init();
                })
        }
        
        function removeEventFromUser(evtId) {
            EventService
                .removeEventFromUser(evtId)
                .success(function (status) {
                    init();
                })
        }
    }

    function ProfileController($location, $routeParams, UserService, EventService) {
        var vm = this;
        var username = $routeParams['uname'];
        var uid = $routeParams['uid'];

        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;
        vm.addFriend = addFriend;
        vm.removeFriend = removeFriend;
        vm.removeUser = removeUser;

        function init() {
             if(username != undefined && username != null) {
                UserService
                    .findUserByUsername(username)
                    .success(function (user) {
                        if(user != "0") {
                            vm.user = user;
                            vm.user.dateCreated = convertDate(vm.user.dateCreated);
                            vm.loggenInUser = false;
                            console.log(vm);
                            UserService
                                .findCurrentUser()
                                .success(function (currentUser) {
                                    if(currentUser != "0" && user._id == currentUser._id) {
                                        vm.user = user;
                                        vm.loggenInUser = true;
                                    }
                                    if(currentUser.friends.indexOf(user._id) > -1) {
                                        vm.alreadyFriends = true;
                                        findConnection(user._id);
                                    }
                                    if(currentUser.role == 'ADMIN') {
                                        vm.isAdmin = true;
                                    } else {
                                        vm.isAdmin = false;
                                    }

                                    UserService
                                        .findAllRequestsForUserById(user._id)
                                        .success(function (userObj) {
                                            var requests = userObj.friendRequests;
                                            vm.alreadyRequested = false;
                                            for(var r in requests) {
                                                var req = requests[r];
                                                if(req.requestedUser == currentUser._id.toString()) {
                                                    vm.alreadyRequested = true;
                                                    break;
                                                }
                                            }

                                            UserService
                                                .findAllUsers()
                                                .success(function (users) {
                                                    vm.users = users;
                                                    EventService
                                                        .findAllEvents()
                                                        .success(function (events) {
                                                            vm.events = events;
                                                        })
                                                });
                                        });
                                })
                                .error(function () {

                                });
                        }
                    })
                    .error(function () {
                    })
             } else if(uid != undefined && uid != null) {
                 UserService
                     .findUserById(uid)
                     .success(function (user) {
                         if(user != "0") {
                             vm.user = user;
                             vm.loggenInUser = false;
                             UserService
                                 .findCurrentUser()
                                 .success(function (currentUser) {
                                     if(currentUser != "0" && user._id == currentUser._id) {
                                         vm.user = user;
                                         vm.loggenInUser = true;
                                     }
                                     if(currentUser.friends.indexOf(user._id) > -1) {
                                         vm.alreadyFriends = true;
                                         findConnection(user._id);
                                     }
                                 })
                                 .error(function () {

                                 });
                         }
                     })
                     .error(function () {
                     });
             } else {
                UserService
                    .findCurrentUser()
                    .success(function (user) {
                        if(user != "0") {
                            vm.user = user;
                            vm.loggenInUser = true;
                        }
                    })
                    .error(function () {

                    });
            }
        }

        init();

        function removeUser(userId) {
            console.log(userId);
            //UserService.deleteUser(userId);
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
        
        function findConnection(userId) {
            UserService
                .findConnection(userId)
                .success(function (con) {
                    vm.connectedOn = convertDate(con.connectedOn);
                })
                .error(function () {

                });
        }

        function removeFriend() {
            UserService
                .removeFriend(vm.user._id)
                .success(function (user) {
                    vm.message = "friend list is updated";
                    $location.url("/user_live/");
                })
                .error(function () {

                })
        }

        function addFriend() {
            UserService
                .addFriendRequest(vm.user._id)
                .success(function () {
                    init();
                });
        }
        
        function logout() {
            UserService.logout();
            $location.url("/login");
        }

        function updateUser() {
            UserService.updateUser(vm.user._id, vm.user);
            vm.message = "Profile has been updated."
        }
        
        function deleteUser() {
            UserService.deleteUser(vm.user._id);
            $location.url('/login');
        }
    }

    function RegisterController($location, $routeParams, UserService) {
        var vm = this;
        vm.register = register;

        function register(user) {
            if(user == undefined || user.email == undefined ||
            user.password == undefined) {
                vm.error = "Please enter email and password.";
                return;
            } else {
                var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
                if(user.email != undefined && !re.test(user.email)) {
                    vm.error = "Email is invalid.";
                    return;
                }
                if(user.password != $('#vpassword').val()) {
                    vm.error = "Passwords did not matched."
                    return;
                }
            }
            var username = user.email.split('@');
            var user = {
                username: username[0],
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                facebook: {
                    id: '',
                    token: ''
                },
                google: {}
            };

             UserService
                .findUserByUsername(user.username)
                .success(function (userObj) {
                    if(userObj != '0') {
                        vm.error = "User already exists for this email";
                    } else {
                       UserService.createUser(user)
                            .success(function (user) {
                                var promise = UserService.login(username[0], user.password);
                                promise
                                    .success(function (user) {
                                        if(user ==  "0") {
                                            vm.error = "No such user";
                                        } else {
                                            $location.url("/user/"+user._id);
                                        }
                                    })
                                    .error(function () {

                                    })
                            })
                            .error(function () {

                            })
                    }
                })
                .error(function (err) {
                    console.log(err);
                });
        }
    }
    
    function FriendListController($location, $routeParams, UserService) {
        var vm = this;
        vm.logout = logout;
        vm.removeFriend = removeFriend;
        vm.openUserProfile = openUserProfile;
        vm.removeFriend = removeFriend;

        function logout() {
            UserService.logout();
            $location.url("/login");
        }

        function init() {
            UserService
                .findCurrentUser()
                .success(function (user) {
                    if(user != "0") {
                        UserService
                            .findFriendsForUser()
                            .success(function (userObj) {
                                vm.user = userObj;
                                var friends = vm.user.friends;
                                var friendsList = [];
                                for(var u in friends) {
                                            var f =
                                            {
                                                _id: friends[u]._id,
                                                firstName:friends[u].firstName,
                                                lastName: friends[u].lastName,
                                                photoUrl: friends[u].photoUrl
                                            };
                                            friendsList.push(f);
                                }
                                vm.friendsList = friendsList;
                                UserService
                                    .findAllConnectionForUser()

                                    .success(function (conObje) {
                                        vm.connections = conObje;
                                        for(var c in conObje) {
                                            var el = conObje[c];
                                            var date = convertDate(el.connectedOn);

                                            for(var f in vm.friendsList) {
                                                if(vm.friendsList[f]._id == el.secondUser) {
                                                    vm.friendsList[f].connectedOn = date;
                                                }
                                                if(vm.friendsList[f]._id == el.firstUser) {
                                                    vm.friendsList[f].connectedOn = date;
                                                }
                                            }
                                        }
                                    })
                                    .error(function () {

                                    });
                            })
                            .error(function () {

                            });
                    }
                })
                .error(function () {

                });
        }

        init();

        function removeFriend(userId) {
            UserService
                .removeFriend(userId)
                .success(function (user) {
                    vm.message = "friend list is updated";
                    init();
                })
                .error(function () {

                })
        }

        function openUserProfile() {
            console.log($('#typeahead').val());
            console.log($('#typeahead1').val());
        }
    }
    
    function FriendRequestController($location, $routeParams, UserService) {
        var vm = this;
        vm.logout = logout;
        vm.addFriend = addFriend;
        vm.cancelRequest = cancelRequest;

        function logout() {
            UserService.logout();
            $location.url("/login");
        }

        function init() {
            UserService
                .findCurrentUser()
                .success(function (user) {
                    vm.user = user;
                    console.log(vm.user._id);
                    if(user != "0") {
                        UserService
                            .findAllRequestsForUser()
                            .success(function (userObj) {
                                var requests = userObj.friendRequests;
                                var friendsList = [];
                                for(var u in requests) {
                                    var f =
                                    {
                                        _id: requests[u].requestedUser
                                    };
                                    friendsList.push(f);
                                }

                                UserService
                                    .findUsersInArray(friendsList)
                                    .success(function (users) {
                                        var newList = [];
                                        for(var u in users) {
                                            var f =
                                            {
                                                _id: users[u]._id,
                                                firstName:users[u].firstName,
                                                lastName: users[u].lastName,
                                                photoUrl: users[u].photoUrl
                                            };
                                            newList.push(f);
                                        }

                                        vm.friendsList = newList;
                                    });
                            })
                            .error(function () {

                            });
                    }
                })
                .error(function () {

                });
        }

        init();

        function addFriend(requesterId) {
            UserService
             .addFriend(requesterId)
             .success(function () {
                vm.message = vm.user.username + " has beed added to your friends.";
                init();
             });
        }
        
        function cancelRequest(requesterId) {
            UserService
                .removeFriendRequest(requesterId)
                .success(function () {
                    vm.message = "Friend request removed.";
                    init();
                });
        }
    }
})();

function convertDate(date) {
    var date = new Date(date);
    var options = { day: 'numeric', year: 'numeric', month: 'long' };
    date = date.toLocaleDateString('en-US', options);
    return date;
}