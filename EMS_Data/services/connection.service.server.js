/**
 * Created by Ajay on 12/7/2016.
 */
module.exports = function (app, model) {

    app.post('/api/connection/:userId', addConnection);
    app.get('/api/connection/:userId', findConnection);
    app.get('/api/friends/', findFriendsForUser);
    app.get('/api/friendsById/:userId', findFriendsForUserbyUserId);
    app.get('/api/connection/', findAllConnectionForUser);
    app.delete('/api/removeFriend/:userId', removeFriend);
    
    function addConnection(req, res) {
        var userId = req.params.userId;
        var currentUserId = req.user._id.toString();
        var connection = {
            firstUser: currentUserId,
            secondUser: userId
        };

        model
            .connectionModel
            .addConnection(connection)
            .then(
                function (newConnection) {
                    /*res.send(newConnection);*/
                    model.friendRequestModel
                        .findRequestByUserRequester(currentUserId, userId)
                        .then(
                            function (obj) {
                                console.log(obj);
                                model.friendRequestModel
                                    .removeFriendRequest(currentUserId, obj._id)
                                    .then(
                                        function (obj1) {
                                            res.send(obj1);
                                        },
                                        function (error) {
                                            res.sendStatus(400).send(error);
                                        }
                                    );
                            },
                            function (error) {
                                res.sendStatus(400).send(error);
                            }
                        );
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
    
    function findConnection(req, res) {
        var userId = req.params.userId;
        model
            .connectionModel
            .findConnection(userId)
            .then(
                function (connection) {
                    if (connection) {
                        res.json(connection[0]);
                    } else {
                        findConnectionForFriend(userId);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findConnectionForFriend(userId) {
        model
            .userModel
            .findConnectionForFriend(userId)
            .then(
                function (connection) {
                    if (connection) {
                        res.json(connection[0]);
                    } else {
                        res.send("0");
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
    
    function findFriendsForUser(req, res) {
        model
            .userModel
            .findFriendsForUser(req.user._id)
            .then(
                function (friends) {
                    res.json(friends);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findFriendsForUserbyUserId(req, res) {
        model
            .userModel
            .findFriendsForUser(req.params.userId)
            .then(
                function (friends) {
                    res.json(friends);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findAllConnectionForUser(req, res) {
        model
            .connectionModel
            .findAllConnectionForUser(req.user._id)
            .then(
                function (cons) {
                    res.json(cons);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
    
    function removeFriend(req, res) {
        var friendId = req.params.userId;
        var userId = req.user._id;
        model
            .connectionModel
            .removeFriendConnection(userId, friendId)
            .then(
                function (status) {
                    res.send(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
};