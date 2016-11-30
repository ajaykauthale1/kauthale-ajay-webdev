/**
 * Created by Ajay on 10/31/2016.
 */
module.exports = function (app, model) {
    var users = [
        {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder",  email: "alice.wonder@gmail.com"},
        {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley",  email: "bob.marley@gmail.com"  },
        {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia",  email: "charly.gracia@gmail.com"  },
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi", email: "jose.annuzi@gmail.com" }
    ];

    app.post('/api/user', createUser);
    app.put('/api/user/:userId', updateUser);
    app.delete('/api/user/:userId', deleteUser);
    app.get('/api/user', findUser);
    app.get('/api/user/:userId', findUserById);
    app.get('/api/user?username=username', findUserByUsername);

    function findUser(req, res) {
        var params = req.params;
        var query = req.query;
        if(query.password && query.username) {
            findUserByCredentials(req, res);
        } else if(query.username) {
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        for(var u in users) {
            var user = users[u];
            if(user.username === username) {
                res.send(user);
                return;
            }
        }
        res.send("0");
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;

        model
            .userModel
            .findUserByCredentials(username, password)
            .then(
                function (users) {
                    if (users) {
                        res.json(users[0]);
                    } else {
                        res.send(0);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        model
            .userModel
            .findUserById(userId)
            .then(
                function (user) {
                    if (user) {
                        res.send(user);
                    } else {
                        res.send(0);
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
        return;
    }

    function createUser(req, res) {
        var user = req.body;
        model
            .userModel
            .createUser(user)
            .then(
                function (newUser) {
                    res.send(newUser);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
        return;
    }
    
    function updateUser(req, res) {
        var newUser = req.body;
        var userId = req.params['userId'];

        model
            .userModel
            .updateUser(userId, newUser)
            .then(
              function (status) {
                  res.send(200);
              },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );

    }

    function deleteUser(req, res) {
        var userId = req.params['userId'];
        model
            .userModel
            .removeUser(userId)
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