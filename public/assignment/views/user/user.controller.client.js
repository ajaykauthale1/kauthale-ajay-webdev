/**
 * Created by Ajay on 10/11/2016.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController)
        .controller("RegisterController", RegisterController);
    
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
                        $location.url("/user/"+user._id);
                    }
                })
                .error(function () {

                })
        }
    }

    function ProfileController($location, $routeParams, UserService) {
        var vm = this;
        //var userId = $routeParams['uid'];

        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        function init() {
            UserService
                //.findUserById(userId)
                .findCurrentUser()
                .success(function (user) {
                    if(user != "0") {
                        vm.user = user;
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

        function updateUser() {
            UserService.updateUser(vm.user._id, vm.user);
        }
        
        function deleteUser() {
            UserService.deleteUser(vm.user._id);
            $location.url('/login');
        }
    }

    function RegisterController($location, $routeParams, UserService) {
        var vm = this;
        vm.register = register;

        function register(username, password) {
            var user = {
                username: username,
                password: password
            };

            if(password != vm.password2) {
                vm.error = true;
                return;
            }

            UserService.createUser(user)
                .success(function (user) {
                    var promise = UserService.login(username, password);
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
    }
})();