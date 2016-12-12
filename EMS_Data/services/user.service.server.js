/**
 * Created by Ajay on 10/31/2016.
 */
module.exports = function (app, model) {
    var GOOGLE_CLIENT_ID = "1067285413091-tui7fiv86pl20j7f5i1od9su7kenekdf.apps.googleusercontent.com";
    var GOOGLE_CLIENT_SECRET = "HBDac4P9eygswMUOrB7iZAhW";
    var GOOGLE_CALLBACK_URL = "http://127.0.0.1:3000/auth/google/callback";
    var FACEBOOK_CLIENT_ID = "1768945863379959";
    var FACEBOOK_CLIENT_SECRET = "f628adee289deb3b068348b16f993244";
    var FACEBOOK_CALLBACK_URL = "http://127.0.0.1:3000/auth/facebook/callback";

    var users = [
        {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder",  email: "alice.wonder@gmail.com"},
        {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley",  email: "bob.marley@gmail.com"  },
        {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia",  email: "charly.gracia@gmail.com"  },
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi", email: "jose.annuzi@gmail.com" }
    ];

    var passport      = require('passport');
    var LocalStrategy    = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var cookieParser  = require('cookie-parser');
    var session       = require('express-session');
    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/EMS/uploads' });

    app.use(session({
        secret: 'this is the secret',
        resave: true,
        saveUninitialized: true
    }));

    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/EMS/#/user_live',
            failureRedirect: '/EMS/#/login'
        }));
    app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/EMS/#/user_live',
            failureRedirect: '/EMS/#/login'
        }));
    app.post("/api/login", passport.authenticate('local'), login);
    app.post("/api/checkLogin", checkLogin);
    app.post("/api/checkAdmin", checkAdmin);
    app.post("/api/logout", logout);
    app.post('/api/user', createUser);
    app.post ("/api/uploads", upload.single('myFile'), uploadImage);
    app.post("/api/addFriend", addFriend);
    app.put('/api/user/:userId', loggedInAndSelf,updateUser);
    app.delete('/api/user/:userId', loggedInAndSelf, deleteUser);
    app.delete('/api/deleteUser/:userId', loggedInAndSelf, deleteUserOnly);
    app.get('/api/user', findUser);
    app.get('/api/admin/users', findAllUsersForAdmin);
    app.get('/api/user/:userId', findUserById);
    app.get('/api/user?username=username', findUserByUsername);
    app.get('/api/users', findAllUsers);
    app.post('/api/usersInArray', findUsersInArray);
    app.post('/api/removeAllFriends/:userId', removeAllFriendsForUser);

    var googleConfig = {
        clientID     : GOOGLE_CLIENT_ID,
        clientSecret : GOOGLE_CLIENT_SECRET,
        callbackURL  : GOOGLE_CALLBACK_URL
    };

    var facebookConfig = {
        clientID     : FACEBOOK_CLIENT_ID,
        clientSecret : FACEBOOK_CLIENT_SECRET,
        callbackURL  : FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'email', 'gender', 'name']
    };


    passport.use(new GoogleStrategy(googleConfig, googleStrategy));
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

    function uploadImage(req, res) {
        var myFile        = req.file;
        var filename      = myFile.filename;     // new file name in uploads folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;
        var url = "/../EMS/uploads/"+filename;

        model.userModel
            .updatePhoto(req.user._id, url)
            .then(function (updateObje) {
                console.log("photo updated")
            });

        url = "/EMS/#/user/"+req.user._id;
        res.redirect(url);
    }

    function checkAdmin(req, res) {
        var loggedIn = req.isAuthenticated();
        if(loggedIn) {
            var isAdmin =  req.user.role == "ADMIN";
        }
        if(loggedIn && isAdmin) {
            res.json(req.user);
        } else {
            res.send('0');
        }
    }

    function loggedInAndSelf(req, res, next) {
        var loggedIn = req.isAuthenticated();
        var userId = req.params.userId;
        var self = userId == req.user._id;
        if(self && loggedIn) {
            next();
        } else if(req.user.role == 'ADMIN') {
            next();
        }
        else {
            res.sendStatus(400).send("You are not the same person");
        }
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        model.userModel
            .findUserByFacebookId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                       return model.userModel
                            .findUserByUsername(emailParts[0])
                            .then(function (user) {
                                if(user) {
                                    return user;
                                } else {
                                    var newFacebookUser = {
                                        username:  emailParts[0],
                                        firstName: profile.name.givenName,
                                        lastName:  profile.name.familyName,
                                        email:     email,
                                        facebook: {
                                            id:    profile.id,
                                            token: token
                                        }
                                    };
                                    return model.userModel.createUser(newFacebookUser);
                                }
                            },
                            function (err) {
                                console.log(user);
                            });
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    function googleStrategy(token, refreshToken, profile, done) {
        model.userModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        return model.userModel
                            .findUserByUsername(emailParts[0])
                            .then(function (user) {
                                    if(user) {
                                        return user;
                                    } else {
                                        var newGoogleUser = {
                                            username:  emailParts[0],
                                            firstName: profile.name.givenName,
                                            lastName:  profile.name.familyName,
                                            email:     email,
                                            google: {
                                                id:    profile.id,
                                                token: token
                                            }
                                        };
                                        return model.userModel.createUser(newGoogleUser);
                                    }
                                },
                                function (err) {
                                    console.log(user);
                                });
                        /*var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return model.userModel.createUser(newGoogleUser);*/
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }
    
    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }
    
    function checkLogin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function localStrategy(username, password, done) {
        model
            .userModel
            .findUserByCredentials(username, password)
            .then(
                function (user) {
                    if (!user) { return done(null, '0'); }
                    return done(null, user);
                },
                function (error) {
                    if (error) { return done(error); }
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        model
            .userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }


    function findUser(req, res) {
        var params = req.params;
        var query = req.query;
        if(query.password && query.username) {
            findUserByCredentials(req, res);
        } else if(query.username) {
            findUserByUsername(req, res);
        } else {
            res.send(req.user);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        model
            .userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    if (user) {
                        res.send(user);
                    } else {
                        res.send("0");
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
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
                  res.sendStatus(200);
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
            .deleteUser(userId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function deleteUserOnly(req, res) {
        var userId = req.params['userId'];
        model
            .userModel
            .deleteUserOnly(userId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }
    
    function findAllUsers(req, res) {
        model
            .userModel
            .findAllUsers(req.query.query)
            .then(function (users) {
                res.send(users);
            },
            function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function removeAllFriendsForUser(req, res) {
        var arr = req.body;
        var userId = req.params.userId;
        model
            .userModel
            .pullFriends(userId, arr)
            .then(function (status) {
                res.sendStatus(200);
            },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    function findUsersInArray(req, res) {
        model
            .userModel
            .findUsersInArray(req.body)
            .then(function (users) {
                    res.json(users);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }
    
    function addFriend(req, res) {
        var newFriend = req.body;
        var currentUser = req.user
    }
    
    function findAllUsersForAdmin(req, res) {
        model
            .userModel
            .findAllUsersForAdmin()
            .then(function (users) {
                    res.send(users);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }
};