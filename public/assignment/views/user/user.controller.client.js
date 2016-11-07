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
            UserService.findUserByCredentials(username, password)
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
        var userId = $routeParams['uid'];

        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;

        function init() {
            UserService.findUserById(userId)
                .success(function (user) {
                    if(user != "0") {
                        vm.user = user;
                    }
                })
                .error(function () {
                    
                })
        }

        init();


        function updateUser() {
            UserService.updateUser(userId, vm.user);
        }
        
        function deleteUser() {
            UserService.deleteUser(userId);
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

            UserService.createUser(user)
                .success(function (user) {
                    $location.url("/user/"+user._id);
                })
                .error(function () {

                })
        }
    }
})();