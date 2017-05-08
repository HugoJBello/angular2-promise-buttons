"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var promise_btn_directive_1 = require("./promise-btn.directive");
var user_cfg_1 = require("./user-cfg");
var Angular2PromiseButtonModule = Angular2PromiseButtonModule_1 = (function () {
    function Angular2PromiseButtonModule() {
    }
    // add forRoot to make it configurable
    Angular2PromiseButtonModule.forRoot = function (userCfgPassedByUser) {
        var cfg = userCfgPassedByUser || {};
        return {
            ngModule: Angular2PromiseButtonModule_1,
            providers: [{ provide: user_cfg_1.userCfg, useValue: cfg }]
        };
    };
    return Angular2PromiseButtonModule;
}());
Angular2PromiseButtonModule = Angular2PromiseButtonModule_1 = __decorate([
    core_1.NgModule({
        declarations: [
            promise_btn_directive_1.PromiseBtnDirective,
        ],
        imports: [],
        exports: [
            promise_btn_directive_1.PromiseBtnDirective,
        ],
        providers: []
    })
], Angular2PromiseButtonModule);
exports.Angular2PromiseButtonModule = Angular2PromiseButtonModule;
var Angular2PromiseButtonModule_1;
