/**
 * Created by Ajay on 10/31/2016.
 */
module.exports = function (app) {
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
        for(var u in users) {
            var user = users[u];
            if(user.username === username && user.password === password) {
                res.send(user);
                return;
            }
        }
        res.send("0");
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        for(var u in users) {
            var user = users[u];
            if(user._id === userId) {
                res.send(user);
                return;
            }
        }
        res.send("0");
    }

    function createUser(req, res) {
        var user = req.body;
        user._id = new Date().getTime()+"";
        users.push(user);
        res.send(user);
        return;
    }
    
    function updateUser(req, res) {
        var newUser = req.body;
        var userId = req.params['userId'];
        for(var u in users) {
            var user = users[u];
            if(user._id === userId) {
                users[u] = newUser;
            }
        }

        res.send(200);
    }

    function deleteUser(req, res) {
        var userId = req.params['userId'];
        for(var u in users) {
            var user = users[u];
            if(user._id === userId) {
                users.splice(u, 1);
            }
        }
        res.send(200);
    }
};