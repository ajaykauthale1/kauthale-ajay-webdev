/**
 * Created by Ajay on 12/1/2016.
 */
module.exports = function (app) {
    var model = require("./models/models.server")();

    require("./services/user.service.server.js")(app, model);
    require("./services/connection.service.server")(app, model);
    require("./services/friendReuest.service.server.js")(app, model);
    require("./services/event.service.server.js")(app, model);
};