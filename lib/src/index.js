"use strict";
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var rest_1 = require("./rest");
exports.Rest = rest_1.Rest;
exports.middleware = rest_1.middleware;
var requireAll = require('require-all');
var Restful = (function () {
    function Restful() {
    }
    Restful.prototype.configure = function (app, options) {
        app.use(cookieParser());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        requireAll({
            dirname: options.dirname,
            filter: /(.*)\.js$/,
            excludeDirs: /^\.(git|svn)$/,
            recursive: true
        });
        rest_1.routers.forEach(function (router) { app.use(router); });
    };
    return Restful;
}());
exports.Restful = Restful;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Restful();
//# sourceMappingURL=index.js.map