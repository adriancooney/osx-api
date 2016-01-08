var express = require("express"),
    bodyParser = require("body-parser"),
    osx = require("./osx"),
    app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.put("/volume", function(req, res) {
    if(!req.body.value) return fail(res, 401, "Please provide value in request body.");

    var value = req.body.value,
        relative = false;

    if(["-", "+"].indexOf(value[0]) !== -1) {
        value = value.substr(1);
        relative = value[0] == "-" ? -1 : 1;
    }

    value = parseInt(value);
    if(isNaN(value)) return fail(res, 401, "Invalid value.");

    if(relative) {
        value *= relative;
        osx.adjustVolume(value);
    } else {
        osx.setVolume(value);
    }
});

app.get("/volume", function(req, res) {
    osx.getVolume(function(err, settings, log) {
        if(err) fail(res, 500, err);
        else respond(res, 200, settings);
    });
});

function respond(res, code, data) {
    res.status(code);
    res.json(data);
}

function success(res) {
    respond(res, 200, { error: false });
}

function fail(res, code, reason) {
    respond(res, code, { error: reason });
}

app.listen(5460);