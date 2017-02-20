"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var src_1 = require("../../src");
var HomeResource = (function () {
    function HomeResource() {
    }
    HomeResource.prototype.async = function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve("hello");
            });
        });
    };
    HomeResource.prototype.get = function () {
        return this.async();
    };
    return HomeResource;
}());
HomeResource = __decorate([
    src_1.Rest('/')
], HomeResource);
var ApiResource = (function () {
    function ApiResource() {
    }
    ApiResource.prototype.use = function () {
        console.info("authorize");
        this.next();
    };
    return ApiResource;
}());
ApiResource = __decorate([
    src_1.Rest('/v1')
], ApiResource);
var TestApiResource = (function () {
    function TestApiResource() {
    }
    TestApiResource.prototype.post = function () {
    };
    TestApiResource.prototype.get = function () {
        return this.response.send("<div>hello</div>");
    };
    return TestApiResource;
}());
__decorate([
    src_1.middleware(function (req, res, next) {
        console.info("middle2");
        next();
    }),
    src_1.middleware(function (req, res, next) {
        console.info("middle1");
        next();
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestApiResource.prototype, "get", null);
TestApiResource = __decorate([
    src_1.Rest('/v1/test')
], TestApiResource);
//# sourceMappingURL=test.js.map