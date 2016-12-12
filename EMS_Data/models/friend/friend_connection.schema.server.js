/**
 * Created by Ajay on 12/7/2016.
 */
module.exports = function () {
    var mongoose = require("mongoose");
    var ConnectionSchema = mongoose.Schema({
        firstUser: String,
        secondUser: String,
        connectedOn: {type: Date, default: Date.now()}
    }, {collection:"connection"});

    return ConnectionSchema;
};