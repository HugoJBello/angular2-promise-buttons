import {AfterContentInit, Directive, ElementRef, Input, OnDestroy} from '@angular/core';
import {Inject} from '@angular/core';
import {DEFAULT_CFG} from './default-promise-btn-config';
import {PromiseBtnConfig} from './promise-btn-config';
import {userCfg} from './user-cfg';

@Directive({
  selector: '[promiseBtn]'
})

export class PromiseBtnDirective implements OnDestroy, AfterContentInit {
  cfg: PromiseBtnConfig;
  // later initialized via initPromiseWatcher()
  promiseWatcher: any;
  // the timeout used for min duration display
  minDurationTimeout: number;
  // boolean to determine minDurationTimeout state
  isMinDurationTimeoutDone: boolean;
  // boolean to determine if promise was resolved
  isPromiseDone: boolean;
  // the promise button button element
  btnEl: HTMLElement;
  // the promise itself or a function expression
  // NOTE: we need the type any here as we might deal with custom promises like bluebird
  promise: any;

  constructor(el: ElementRef, @Inject(userCfg) userCfg: {}) {
    // provide configuration
    this.cfg = Object.assign({}, DEFAULT_CFG, userCfg);

    // save element
    this.btnEl = el.nativeElement;
  }

  @Input()
  set promiseBtn(promise: any) {
    this.promise = promise;
    this.checkAndInitPromiseHandler(this.btnEl);
  }

  ngAfterContentInit() {
    this.prepareBtnEl(this.btnEl);
    // trigger changes once to handle initial promises
    this.checkAndInitPromiseHandler(this.btnEl);
  }

  ngOnDestroy() {
    // cleanup
    if (this.minDurationTimeout) {
      clearTimeout(this.minDurationTimeout);
    }
  }

  /**
   * Initializes all html and event handlers
   * @param {Object}btnEl
   */
  prepareBtnEl(btnEl: HTMLElement) {
    // handle promises passed via promiseBtn attribute
    this.appendSpinnerTpl(btnEl);
    this.addHandlersForCurrentBtnOnlyIfSet(btnEl);
  }

  /**
   * Checks if all required parameters are there and inits the promise handler
   * @param {Object}btnEl
   */
  checkAndInitPromiseHandler(btnEl: HTMLElement) {
    if (btnEl && this.promise) {
      if (!this.promiseWatcher) {
        this.initPromiseHandler(this.promise, btnEl);
      }
    }
  }

  /**
   * Helper FN to add class
   * @param {Object}el
   */
  addLoadingClass(el: any) {
    el.className += ' ' + this.cfg.btnLoadingClass;
    el.className = el.className.trim();
  }

  /**
   * Helper FN to remove classes
   * @param {Object}el
   */
  removeLoadingClass(el: any) {
    const classNameToRemove = this.cfg.btnLoadingClass;
    let newElClass = ' ' + el.className + ' ';
    while (newElClass.indexOf(' ' + classNameToRemove + ' ') !== -1) {
      newElClass = newElClass.replace(' ' + classNameToRemove + ' ', '');
    }
    el.className = newElClass.trim();
  }

  /**
   * Handles everything to be triggered when the button is set
   * to loading state.
   * @param {Object}btnEl
   */
  initLoadingState(btnEl: HTMLElement) {
    if (!this.cfg.handleCurrentBtnOnly) {
      if (this.cfg.btnLoadingClass) {
        this.addLoadingClass(btnEl);
      }
      if (this.cfg.disableBtn) {
        this.disableBtn(btnEl);
      }
    }
  }

  /**
   * Handles everything to be triggered when loading is finished
   * @param {Object}btnEl
   */
  cancelLoadingStateIfPromiseAndMinDurationDone(btnEl: HTMLElement) {
    if ((!this.cfg.minDuration || this.isMinDurationTimeoutDone) && this.isPromiseDone) {
      if (this.cfg.btnLoadingClass) {
        this.removeLoadingClass(btnEl);
      }
      if (this.cfg.disableBtn) {
        this.enableBtn(btnEl);
      }
    }
  }

  /**
   * @param {Object}btnEl
   */
  disableBtn(btnEl: HTMLElement) {
    btnEl.setAttribute('disabled', 'disabled');
  }

  /**
   * @param {Object}btnEl
   */
  enableBtn(btnEl: HTMLElement) {
    btnEl.removeAttribute('disabled');
  }

  /**
   * Initializes a watcher for the promise. Also takes
   * this.cfg.minDuration into account if given.
   * @param {Object}promise
   * @param {Object}btnEl
   */

  initPromiseHandler(promise: any, btnEl: HTMLElement) {
    // watch promise to resolve or fail
    this.isMinDurationTimeoutDone = false;
    this.isPromiseDone = false;

    // create timeout if option is set
    if (this.cfg.minDuration) {
      this.minDurationTimeout = setTimeout(() => {
        this.isMinDurationTimeoutDone = true;
        this.cancelLoadingStateIfPromiseAndMinDurationDone(btnEl);
      }, this.cfg.minDuration);
    }

    const resolveLoadingState = () => {
      this.isPromiseDone = true;
      this.cancelLoadingStateIfPromiseAndMinDurationDone(btnEl);
    };

    // for regular promises
    if (promise && promise.then) {
      this.initLoadingState(btnEl);
      if (promise.finally) {
        promise.finally(resolveLoadingState);
      } else {
        promise
          .then(resolveLoadingState)
          .catch(resolveLoadingState);
      }
    }
  }


  /**
   * $compile and append the spinner template to the button.
   * @param {Object}btnEl
   */
  appendSpinnerTpl(btnEl: HTMLElement) {
    // TODO add some kind of compilation later on
    btnEl.insertAdjacentHTML('beforeend', this.cfg.spinnerTpl);
  }

  /**
   * Used to limit loading state to show only for the currently
   * clicked button.
   * @param {Object}btnEl
   */
  addHandlersForCurrentBtnOnlyIfSet(btnEl: HTMLElement) {
    // handle current button only options via click
    if (this.cfg.handleCurrentBtnOnly) {
      if (this.cfg.btnLoadingClass) {
        btnEl.addEventListener(this.cfg.CLICK_EVENT, () => {
          this.addLoadingClass(btnEl);
        });
      }
      if (this.cfg.disableBtn) {
        btnEl.addEventListener(this.cfg.CLICK_EVENT, () => {
          this.disableBtn(btnEl);
        });
      }
    }
  }
}
