/**
 * Created by Ajay on 10/11/2016.
 */
(function() {
    angular
        .module("EMS")
        .config(Config);
    function Config($routeProvider) {
        $routeProvider
            .when("/login", {
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/admin", {
                templateUrl: "views/admin/admin.view.client.html",
                controller: "AdminController",
                controllerAs: "model",
                resolve: {
                    checkAdmin: checkAdmin
                }
            })
            .when("/users", {
                templateUrl: "views/admin/users.view.client.html",
                controller: "AdminController",
                controllerAs: "model",
                resolve: {
                    checkAdmin: checkAdmin
                }
            })
            .when("/events", {
                templateUrl: "views/admin/events.view.client.html",
                controller: "AdminController",
                controllerAs: "model",
                resolve: {
                    checkAdmin: checkAdmin
                }
            })
            .when("/register", {
                templateUrl: "views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/user", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/user/:uid", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/user_friend/:uname", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/user_live", {
                templateUrl: "views/user/live-feed.view.client.html",
                controller: "LiveFeedController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/user_live/:uid", {
                templateUrl: "views/user/live-feed.view.client.html",
                controller: "LiveFeedController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/user_friends", {
                templateUrl: "views/user/user-friends.view.client.html",
                controller: "FriendListController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/user_requests", {
                templateUrl: "views/user/friend-request.view.client.html",
                controller: "FriendRequestController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/event_list", {
                templateUrl: "views/event/event-list.view.client.html",
                controller: "EventListController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/event", {
                templateUrl: "views/event/event-edit.view.client.html",
                controller: "EventController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                }
            })
            .when("/event/:evtid", {
                templateUrl: "views/event/event-edit.view.client.html",
                controller: "EventController",
                controllerAs: "model",
                resolve: {
                    checkLogin: checkLogin
                    //TODO
                    /*,
                    checkEvent: checkEvent*/
                }
            })
            .otherwise ({
              redirectTo: "/login"
            });
        
        function checkLogin($q, UserService, $location) {
            var deferred = $q.defer();
            UserService
                .checkLogin()
                .success(
                    function (user) {
                        if(user != '0') {
                            deferred.resolve();
                        } else {
                            $location.url("/login");
                        }
                    }
                );

            return deferred.promise;
        }
        
        function checkEvent($route, $q, EventService, $location) {
            var deferred = $q.defer();
           EventService
                .checkEvent($route.current.params.evtid)
                .success(
                    function (event) {
                        if(event != '0') {
                            deferred.resolve();
                        } else {
                            $location.url("/login");
                        }
                    }
                );

            return deferred.promise;
        }

        function checkAdmin($q, UserService, $location) {
            var deferred = $q.defer();
            UserService
                .checkAdmin()
                .success(
                    function (user) {
                        if(user != '0') {
                            deferred.resolve();
                        } else {
                            $location.url("/login");
                        }
                    }
                );

            return deferred.promise;
        }
    }
})();