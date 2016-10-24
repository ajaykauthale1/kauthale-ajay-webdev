/**
 * Created by Ajay on 10/11/2016.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController);
    
    function LoginController($location, UserService) {
        var vm = this;
        vm.login = function (username, password) {
            var user = UserService.findUserByCredentials(username, password);
            if(user ==  null) {
                vm.error = "No such user";
            } else {
                $location.url("/user/"+user._id);
            }
        }
    }

    function ProfileController($routeParams, UserService) {
        var vm = this;
        var userId = $routeParams['uid'];
        var user = UserService.findUserById(userId);
        vm.user = user;
    }
})();