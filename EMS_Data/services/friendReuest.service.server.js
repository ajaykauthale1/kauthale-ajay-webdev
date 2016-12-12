/**
 * Created by Ajay on 12/7/2016.
 */
module.exports = function (app, model) {

    app.post('/api/request/:reqUserId', addFriendRequest);
    app.get('/api/request/', findAllRequestsForUser);
    app.get('/api/request/:userId', findAllRequestsForUserById);
    app.delete('/api/request/:reqId', removeFriendRequest);
    app.delete('/api/request/', removeAllFriendRequestsForUser);

    function addFriendRequest(req, res) {
        var requestedUser = req.params.reqUserId;
        var currentUserId = req.user._id.toString();
        var request = {
            requestedUser: currentUserId,
            user: requestedUser
        };

        model
            .friendRequestModel
            .addFriendRequest(requestedUser, request)
            .then(
                function (newReq) {
                    res.send(newReq);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
    
    function findAllRequestsForUser(req, res) {
        model
            .friendRequestModel
            .findAllRequestsForUser(req.user._id)
            .then(
                function (req) {
                    res.send(req);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
    
    function findAllRequestsForUserById(req, res) {
        model
            .friendRequestModel
            .findAllRequestsForUser(req.params.userId)
            .then(
                function (req) {
                    res.send(req);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
    
    function removeFriendRequest(req, res) {
        var reqId = req.params.reqId;

        model
            .friendRequestModel
            .findRequestByUserRequester(req.user._id.toString(), reqId)
            .then(function (obj) {
                model
                    .friendRequestModel
                    .removeFriendRequest(req.user._id, obj._id)
                    .then(
                        function (status) {
                            res.send(200);
                        },
                        function (error) {
                            res.sendStatus(400).send(error);
                        }
                    );
            });
    }
    
    function removeAllFriendRequestsForUser(req, res) {
        model
            .friendRequestModel
            .removeAllFriendRequestsForUser(req.user._id)
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
