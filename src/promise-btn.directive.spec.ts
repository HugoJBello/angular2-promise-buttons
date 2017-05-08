import {ElementRef} from '@angular/core';
import {Component} from '@angular/core';
import {DebugElement} from '@angular/core';
import {async, TestBed} from '@angular/core/testing';
import {ComponentFixture} from '@angular/core/testing';
import {PromiseBtnDirective} from './promise-btn.directive';
import {userCfg} from './user-cfg';
import {By} from '@angular/platform-browser';

class MockElementRef extends ElementRef {
  constructor() {
    super(null);
    this.nativeElement = {};
  }
}

@Component({
  selector: 'test-component',
  template: ''
})
class TestComponent {
  asyncMethod: any;
  testPromise: Promise<any>;
}

describe('PromiseBtnDirective', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        PromiseBtnDirective
      ],
      providers: [
        // more providers
        {
          provide: ElementRef,
          useClass: MockElementRef
        },
        {
          provide: userCfg, useClass: class {
        }
        },
      ]
    });
  }));

  let fixture: ComponentFixture<TestComponent>;
  let buttonDebugElement: DebugElement;
  let buttonElement: HTMLButtonElement;
  let promiseBtnDirective: PromiseBtnDirective;

  beforeEach(() => {
    fixture = TestBed.overrideComponent(TestComponent, {
      set: {
        template: '<button (click)="asyncMethod($event)" [promiseBtn]="testPromise">BUTTON_TEXT</button>'
      }
    }).createComponent(TestComponent);
    fixture.detectChanges();

    buttonDebugElement = fixture.debugElement.query(By.css('button'));
    buttonElement = <HTMLButtonElement> buttonDebugElement.nativeElement;
    promiseBtnDirective = buttonDebugElement.injector.get<PromiseBtnDirective>(PromiseBtnDirective);
  });

  describe('default cfg', () => {
    describe('basic init', () => {
      it('should create an instance', () => {
        expect(promiseBtnDirective).toBeDefined();
        expect(promiseBtnDirective.cfg).toBeDefined();
        // const directive = new PromiseBtnDirective({}, {});
        // expect(directive).toBeTruthy();
      });
      it('should append the spinner el to the button', () => {
        const spinnerEl = buttonElement.querySelector('span');
        expect(spinnerEl.outerHTML).toBe('<span class="btn-spinner"></span>');
      });
    });

    describe('once a promise is passed', () => {
      beforeEach(() => {
        fixture.componentInstance.testPromise = new Promise(() => {
        });
        spyOn(promiseBtnDirective, 'initLoadingState').and.callThrough();
        fixture.detectChanges();
      });

      it('should init the loading state', () => {
        expect(promiseBtnDirective.initLoadingState).toHaveBeenCalled();
      });
      it('should add .is-loading class', async(() => {
        fixture.whenStable().then(() => {
          expect(buttonElement.className).toBe('is-loading');
        });
      }));
      it('should disable the button', async(() => {
        fixture.whenStable().then(() => {
          expect(buttonElement.getAttribute('disabled')).toBe('disabled');
        });
      }));
    });

    describe('once a passed promise is resolved', () => {
      let promise;
      let resolve: any;
      beforeEach(async(() => {
        promise = new Promise((res) => {
          resolve = res;
        });
        fixture.componentInstance.testPromise = promise;

        // test init before to be sure
        spyOn(promiseBtnDirective, 'initLoadingState').and.callThrough();
        fixture.detectChanges();
        expect(promiseBtnDirective.initLoadingState).toHaveBeenCalled();

        fixture.whenStable().then(() => {
          spyOn(promiseBtnDirective, 'cancelLoadingStateIfPromiseAndMinDurationDone').and.callThrough();
          resolve();
        });
        fixture.detectChanges();
      }));

      it('should cancel the loading state', () => {
        expect(promiseBtnDirective.cancelLoadingStateIfPromiseAndMinDurationDone).toHaveBeenCalled();
      });
      it('should remove the .is-loading class', () => {
        expect(buttonElement.className).toBe('');
      });
      it('should enable the button', () => {
        expect(buttonElement.hasAttribute('disabled')).toBe(false);
      });
    });

    describe('once a passed promise is rejected', () => {
      let promise;
      let reject: any;
      beforeEach(async(() => {
        promise = new Promise((res, rej) => {
          reject = rej;
        });
        fixture.componentInstance.testPromise = promise;

        // test init before to be sure
        spyOn(promiseBtnDirective, 'initLoadingState').and.callThrough();
        fixture.detectChanges();
        expect(promiseBtnDirective.initLoadingState).toHaveBeenCalled();

        fixture.whenStable().then(() => {
          spyOn(promiseBtnDirective, 'cancelLoadingStateIfPromiseAndMinDurationDone').and.callThrough();
          reject();
        });
        fixture.detectChanges();
      }));

      it('should cancel the loading state', () => {
        expect(promiseBtnDirective.cancelLoadingStateIfPromiseAndMinDurationDone).toHaveBeenCalled();
      });
      it('should remove the .is-loading class', () => {
        expect(buttonElement.className).toBe('');
      });
      it('should enable the button', () => {
        expect(buttonElement.hasAttribute('disabled')).toBe(false);
      });
    });
  });

  describe('cfg:minDuration', () => {
    describe('once a passed promise is resolved but minDuration has not been exceeded', () => {
      let promise;
      let resolve: any;
      beforeEach((done) => {
        promiseBtnDirective.cfg.minDuration = 50;
        promise = new Promise((res) => {
          resolve = res;
        });
        fixture.componentInstance.testPromise = promise;

        // test init before to be sure
        spyOn(promiseBtnDirective, 'initLoadingState').and.callThrough();
        fixture.detectChanges();
        expect(promiseBtnDirective.initLoadingState).toHaveBeenCalled();

        spyOn(promiseBtnDirective, 'cancelLoadingStateIfPromiseAndMinDurationDone').and.callThrough();
        setTimeout(() => {
          resolve();
          setTimeout(() => {
            done();
          }, 10);
        }, 10);
      });

      it('should try to cancel the loading state', () => {
        expect(promiseBtnDirective.cancelLoadingStateIfPromiseAndMinDurationDone).toHaveBeenCalled();
      });
      it('should not yet remove the .is-loading class', () => {
        expect(buttonElement.className).toBe('is-loading');
      });
      it('should not yet enable the button', () => {
        expect(buttonElement.hasAttribute('disabled')).toBe(true);
      });
    });

    describe('once a passed promise is resolved and the minDuration has been exceeded', () => {
      let promise;
      let resolve: any;
      beforeEach((done) => {
        promiseBtnDirective.cfg.minDuration = 30;
        promise = new Promise((res) => {
          resolve = res;
        });
        fixture.componentInstance.testPromise = promise;

        // test init before to be sure
        spyOn(promiseBtnDirective, 'initLoadingState').and.callThrough();
        fixture.detectChanges();
        expect(promiseBtnDirective.initLoadingState).toHaveBeenCalled();

        spyOn(promiseBtnDirective, 'cancelLoadingStateIfPromiseAndMinDurationDone').and.callThrough();
        setTimeout(() => {
          resolve();
          setTimeout(() => {
            done();
          }, (+promiseBtnDirective.cfg.minDuration + 5));
        }, 10);
      });

      it('should try to cancel the loading state', () => {
        expect(promiseBtnDirective.cancelLoadingStateIfPromiseAndMinDurationDone).toHaveBeenCalled();
      });
      it('should remove the .is-loading class', () => {
        expect(buttonElement.className).toBe('');
      });
      it('should enable the button', () => {
        expect(buttonElement.hasAttribute('disabled')).toBe(false);
      });
    });
  });
});

