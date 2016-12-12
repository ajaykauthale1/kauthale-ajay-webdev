/**
 * Created by Ajay on 10/31/2016.
 */
module.exports = function (app, model) {
    var GOOGLE_CLIENT_ID = "1067285413091-tui7fiv86pl20j7f5i1od9su7kenekdf.apps.googleusercontent.com";
    var GOOGLE_CLIENT_SECRET = "HBDac4P9eygswMUOrB7iZAhW";
    /*var GOOGLE_CALLBACK_URL = "http://127.0.0.1:3000/auth/google/callback";*/
    var GOOGLE_CALLBACK_URL = "http://ec2-35-161-175-157.us-west-2.compute.amazonaws.com:3000/auth/google/callback";
    var FACEBOOK_CLIENT_ID = "1768945863379959";
    var FACEBOOK_CLIENT_SECRET = "f628adee289deb3b068348b16f993244";
    /*var FACEBOOK_CALLBACK_URL = "http://127.0.0.1:3000/auth/facebook/callback";*/
    var FACEBOOK_CALLBACK_URL = "http://ec2-35-161-175-157.us-west-2.compute.amazonaws.com:3000/auth/facebook/callback";

    var users = [
        {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder",  email: "alice.wonder@gmail.com"},
        {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley",  email: "bob.marley@gmail.com"  },
        {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia",  email: "charly.gracia@gmail.com"  },
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi", email: "jose.annuzi@gmail.com" }
    ];

    var bcrypt = require("bcrypt-nodejs");
    var passport      = require('passport');
    var LocalStrategy    = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var cookieParser  = require('cookie-parser');
    var session       = require('express-session');

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
            successRedirect: '/assignment/#/user',
            failureRedirect: '/assignment/#/login'
        }));
    app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/assignment/#/user',
            failureRedirect: '/assignment/#/login'
        }));
    app.post("/api/login", passport.authenticate('local'), login);
    app.post("/api/checkLogin", checkLogin);
    app.post("/api/checkAdmin", checkAdmin);
    app.post("/api/logout", logout);
    app.post('/api/user', createUser);
    app.put('/api/user/:userId', loggedInAndSelf,updateUser);
    app.delete('/api/user/:userId', loggedInAndSelf, deleteUser);
    app.get('/api/user', findUser);
    app.get('/api/user/:userId', findUserById);
    app.get('/api/user?username=username', findUserByUsername);

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
    
    function checkAdmin(req, res) {
        var loggedIn = req.isAuthenticated();
        var isAdmin =  req.user.role == "ADMIN";
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
        } else {
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
        res.send(200);
    }
    
    function checkLogin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function localStrategy(username, password, done) {
        model
            .userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    if (user && bcrypt.compareSync(password, user.password)) { return done(null, user); }
                    return done(null, '0');
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
        user.password = bcrypt.hashSync(user.password);
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
            .deleteUser(userId)
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