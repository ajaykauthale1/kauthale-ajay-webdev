/**
 * Created by Ajay on 10/11/2016.
 */
(function () {
    angular
        .module("EMS")
        .factory("UserService", UserService);
    
    function UserService($http) {

        var api = {
            createUser   : createUser,
            findUserById : findUserById,
            findCurrentUser: findCurrentUser,
            findUserByUsername : findUserByUsername,
            findUserByCredentials : findUserByCredentials,
            updateUser : updateUser,
            deleteUser : deleteUser,
            deleteUserOnly: deleteUserOnly,
            login: login,
            checkLogin:checkLogin,
            logout: logout,
            checkAdmin: checkAdmin,
            addFriend: addFriend,
            findConnection: findConnection,
            findFriendsForUser: findFriendsForUser,
            findAllConnectionForUser: findAllConnectionForUser,
            removeFriend: removeFriend,
            addFriendRequest: addFriendRequest,
            findAllRequestsForUser: findAllRequestsForUser,
            removeFriendRequest: removeFriendRequest,
            removeAllFriendRequestsForUser: removeAllFriendRequestsForUser,
            findUsersInArray: findUsersInArray,
            findAllUsers: findAllUsers,
            findFriendsForUserbyUserId: findFriendsForUserbyUserId,
            removeAllFriendsForUser: removeAllFriendsForUser,
            findAllRequestsForUserById: findAllRequestsForUserById
        };

        return api;

        function logout() {
            $http.post("/api/logout");
        }
        
        function checkLogin() {
            return $http.post("/api/checkLogin");
        }

        function checkAdmin() {
            return $http.post("/api/checkAdmin");
        }

        function login(username, passport) {
            var user = {
                username: username,
                password: passport
            };

            return $http.post("/api/login", user);
        }

        function createUser(user) {
            return $http.post("/api/user", user);
        }

        function findUserById(userId) {
            var url = "/api/user/" + userId;
            return $http.get(url);
        }
        
        function findCurrentUser() {
            var url = "/api/user/";
            return $http.get(url);
        }

        function findUserByUsername(username) {
            var url = "/api/user?username=" + username;
            return $http.get(url);
        }

        function findUserByCredentials(username, password) {
            var url = "/api/user?username=" + username + "&password=" + password;
            return $http.get(url);
        }

        function updateUser(userId, user) {
            var url = "/api/user/" + userId;
            return $http.put(url, user);
        }

        function deleteUser(userId) {
            var url = "/api/user/" + userId;
            return $http.delete(url);
        }

        function deleteUserOnly(userId) {
            var url = "/api/deleteUser/" + userId;
            return $http.delete(url);
        }

        function addFriend(userId) {
            var url = "/api/connection/" + userId;
            return $http.post(url);
        }
        
        function findConnection(userId) {
            var url = "/api/connection/" + userId;
            return $http.get(url);
        }

        function findFriendsForUser() {
            var url = "/api/friends/";
            return $http.get(url);
        }

        function findFriendsForUserbyUserId(userId) {
            var url = "/api/friendsById/"+userId;
            return $http.get(url);
        }
        
        function findAllConnectionForUser() {
            var url = "/api/connection/";
            return $http.get(url);
        }
        
        function removeFriend(userId) {
            var url = "/api/removeFriend/" + userId;
            return $http.delete(url);
        }

        function addFriendRequest(reqUserId) {
            var url = "/api/request/" + reqUserId;
            return $http.post(url);
        }
        
        function findAllRequestsForUser() {
            var url = "/api/request/";
            return $http.get(url);
        }

        function findAllRequestsForUserById(userId) {
            var url = "/api/request/"+userId;
            return $http.get(url);
        }
        
        function removeFriendRequest(reqId) {
            var url = "/api/request/" + reqId;
            return $http.delete(url);
        }
        
        function removeAllFriendRequestsForUser() {
            var url = "/api/request/";
            return $http.delete(url);
        }

        function findUsersInArray(users) {
            var url = "/api/usersInArray";
            return $http.post(url, users);
        }

        function findAllUsers() {
            var url = "/api/admin/users";
            return $http.get(url);
        }

        function removeAllFriendsForUser(userId, arr) {
            var url = "/api/removeAllFriends/"+userId;
            return $http.post(url, arr);
        }
    }
})();