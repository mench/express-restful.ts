"use strict";
var express = require("express");
var logger = require('morgan');
var _1 = require("../src/");
var server = express();
server.use(logger('dev'));
_1.default.configure(server, {
    dirname: __dirname + '/resources'
});
server.listen(8080);
//# sourceMappingURL=server.js.map