"use strict";
var http = require("http");
var express_1 = require("express");
var methods = [
    'get',
    'post',
    'put',
    'patch',
    'delete',
    'head',
    'use'
];
exports.routers = [];
var MIDDLEWARE = Symbol('MIDDLEWARE');
var Handler = (function () {
    function Handler(Class) {
        this.resource = new Class();
    }
    Handler.prototype.handle = function (req, res, next, action) {
        var _this = this;
        Object.defineProperties(this.resource, {
            headers: { value: req.headers, configurable: true },
            query: { value: req.query, configurable: true },
            params: { value: req.params, configurable: true },
            path: { value: req.path, configurable: true },
            body: { value: req.body, configurable: true },
            response: { value: res, configurable: true },
            request: { value: req, configurable: true },
            next: { value: next, configurable: true }
        });
        var args = Object.keys(this.resource.params).map(function (k) { return _this.resource.params[k]; });
        args.push(req);
        args.push(res);
        args.push(next);
        var resource = this.resource;
        var promise = new Promise(function (resolve, reject) {
            try {
                resolve(resource[action].apply(resource, args));
            }
            catch (e) {
                reject(e);
            }
        });
        promise.then(function (result) {
            var r = result;
            var h = http;
            if (result instanceof h.ServerResponse) {
                return;
            }
            if (result instanceof Error) {
                res.status(r.code || 500).json(result);
            }
            else if (typeof result != 'undefined' && result != null) {
                res.json(result);
            }
            else if (result == null && typeof result == 'object') {
                res.status(404).json({
                    code: 404,
                    message: 'resource not found'
                });
            }
        }).catch(function (err) {
            console.error(err);
            var e = err;
            try {
                if (err instanceof Error) {
                    return res.status(e.code || 500).json({
                        error: e.message,
                        errors: e.errors,
                        code: e.code || 500,
                        stack: e.stack.split("\n")
                    });
                }
                res.status(500).send(err);
            }
            catch (e) {
                console.error(e);
                res.status(500).send(e);
            }
        });
    };
    Handler.prototype.getClass = function () {
        return this.resource.constructor;
    };
    return Handler;
}());
function middleware(method) {
    if (!method || !(method instanceof Function)) {
        throw new Error('middleware must be Function');
    }
    return function (self, key, descriptor) {
        if (typeof self.constructor != 'function') {
            throw new Error('middleware must defined on method not on class');
        }
        if (!self.constructor[MIDDLEWARE]) {
            self.constructor[MIDDLEWARE] = [];
        }
        self.constructor[MIDDLEWARE].push(method);
    };
}
exports.middleware = middleware;
function Rest(url) {
    return function (Class, key) {
        if (typeof Class != 'function') {
            throw new Error('must be class not a prop..');
        }
        var router = express_1.Router();
        var handler = new Handler(Class);
        methods.forEach(function (action) {
            if (handler.resource[action] instanceof Function) {
                var filters = handler.getClass()[MIDDLEWARE] || [];
                router[action](url, filters, function (req, res, next) {
                    handler.handle(req, res, next, action);
                });
            }
        });
        exports.routers.push(router);
    };
}
exports.Rest = Rest;
//# sourceMappingURL=rest.js.map