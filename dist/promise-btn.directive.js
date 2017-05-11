"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var default_promise_btn_config_1 = require("./default-promise-btn-config");
var user_cfg_1 = require("./user-cfg");
var PromiseBtnDirective = (function () {
    function PromiseBtnDirective(el, userCfg) {
        // provide configuration
        this.cfg = Object.assign({}, default_promise_btn_config_1.DEFAULT_CFG, userCfg);
        // save element
        this.btnEl = el.nativeElement;
    }
    Object.defineProperty(PromiseBtnDirective.prototype, "promiseBtn", {
        set: function (promise) {
            this.promise = promise;
            this.checkAndInitPromiseHandler(this.btnEl);
        },
        enumerable: true,
        configurable: true
    });
    PromiseBtnDirective.prototype.ngAfterContentInit = function () {
        this.prepareBtnEl(this.btnEl);
        // trigger changes once to handle initial promises
        this.checkAndInitPromiseHandler(this.btnEl);
    };
    PromiseBtnDirective.prototype.ngOnDestroy = function () {
        // cleanup
        if (this.minDurationTimeout) {
            clearTimeout(this.minDurationTimeout);
        }
    };
    /**
     * Initializes all html and event handlers
     * @param {Object}btnEl
     */
    PromiseBtnDirective.prototype.prepareBtnEl = function (btnEl) {
        // handle promises passed via promiseBtn attribute
        this.appendSpinnerTpl(btnEl);
        this.addHandlersForCurrentBtnOnlyIfSet(btnEl);
    };
    /**
     * Checks if all required parameters are there and inits the promise handler
     * @param {Object}btnEl
     */
    PromiseBtnDirective.prototype.checkAndInitPromiseHandler = function (btnEl) {
        if (btnEl && this.promise) {
            this.initPromiseHandler(this.promise, btnEl);
        }
    };
    /**
     * Helper FN to add class
     * @param {Object}el
     */
    PromiseBtnDirective.prototype.addLoadingClass = function (el) {
        if (typeof this.cfg.btnLoadingClass === 'string') {
            el.classList.add(this.cfg.btnLoadingClass);
        }
    };
    /**
     * Helper FN to remove classes
     * @param {Object}el
     */
    PromiseBtnDirective.prototype.removeLoadingClass = function (el) {
        if (typeof this.cfg.btnLoadingClass === 'string') {
            el.classList.remove(this.cfg.btnLoadingClass);
        }
    };
    /**
     * Handles everything to be triggered when the button is set
     * to loading state.
     * @param {Object}btnEl
     */
    PromiseBtnDirective.prototype.initLoadingState = function (btnEl) {
        this.addLoadingClass(btnEl);
        this.disableBtn(btnEl);
    };
    /**
     * Handles everything to be triggered when loading is finished
     * @param {Object}btnEl
     */
    PromiseBtnDirective.prototype.cancelLoadingStateIfPromiseAndMinDurationDone = function (btnEl) {
        if ((!this.cfg.minDuration || this.isMinDurationTimeoutDone) && this.isPromiseDone) {
            this.removeLoadingClass(btnEl);
            this.enableBtn(btnEl);
        }
    };
    /**
     * @param {Object}btnEl
     */
    PromiseBtnDirective.prototype.disableBtn = function (btnEl) {
        if (this.cfg.disableBtn) {
            btnEl.setAttribute('disabled', 'disabled');
        }
    };
    /**
     * @param {Object}btnEl
     */
    PromiseBtnDirective.prototype.enableBtn = function (btnEl) {
        if (this.cfg.disableBtn) {
            btnEl.removeAttribute('disabled');
        }
    };
    /**
     * Initializes a watcher for the promise. Also takes
     * this.cfg.minDuration into account if given.
     * @param {Object}promise
     * @param {Object}btnEl
     */
    PromiseBtnDirective.prototype.initPromiseHandler = function (promise, btnEl) {
        var _this = this;
        // return if something else then a promise is passed
        if (!promise || !promise.then) {
            return;
        }
        // watch promise to resolve or fail
        this.isMinDurationTimeoutDone = false;
        this.isPromiseDone = false;
        // create timeout if option is set
        if (this.cfg.minDuration) {
            this.minDurationTimeout = setTimeout(function () {
                _this.isMinDurationTimeoutDone = true;
                _this.cancelLoadingStateIfPromiseAndMinDurationDone(btnEl);
            }, this.cfg.minDuration);
        }
        var resolveLoadingState = function () {
            _this.isPromiseDone = true;
            _this.cancelLoadingStateIfPromiseAndMinDurationDone(btnEl);
        };
        if (!this.cfg.handleCurrentBtnOnly) {
            this.initLoadingState(btnEl);
        }
        if (promise.finally) {
            promise.finally(resolveLoadingState);
        }
        else {
            promise
                .then(resolveLoadingState)
                .catch(resolveLoadingState);
        }
    };
    /**
     * $compile and append the spinner template to the button.
     * @param {Object}btnEl
     */
    PromiseBtnDirective.prototype.appendSpinnerTpl = function (btnEl) {
        // TODO add some kind of compilation later on
        btnEl.insertAdjacentHTML('beforeend', this.cfg.spinnerTpl);
    };
    /**
     * Used to limit loading state to show only for the currently
     * clicked button.
     * @param {Object}btnEl
     */
    PromiseBtnDirective.prototype.addHandlersForCurrentBtnOnlyIfSet = function (btnEl) {
        var _this = this;
        // handle current button only options via click
        if (this.cfg.handleCurrentBtnOnly) {
            btnEl.addEventListener(this.cfg.CLICK_EVENT, function () {
                _this.initLoadingState(btnEl);
            });
        }
    };
    return PromiseBtnDirective;
}());
PromiseBtnDirective.decorators = [
    { type: core_1.Directive, args: [{
                selector: '[promiseBtn]'
            },] },
];
/** @nocollapse */
PromiseBtnDirective.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: undefined, decorators: [{ type: core_1.Inject, args: [user_cfg_1.userCfg,] },] },
]; };
PromiseBtnDirective.propDecorators = {
    'promiseBtn': [{ type: core_1.Input },],
};
exports.PromiseBtnDirective = PromiseBtnDirective;
//# sourceMappingURL=promise-btn.directive.js.map