import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { dispatchTouchEvent } from '../core/testing';
import { Toast } from './toast.service';
import { ToastComponent } from './toast.component';
import { ToastModule } from './toast.module';
import { IconModule, ButtonModule } from '../..';
import { Button } from '../button/button.component';

describe('ToastComponent', () => {
  let component: TestToastComponent;
  let fixture: ComponentFixture<TestToastComponent>;
  let toastEle;
  let toastEle1;
  let buttons;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestToastComponent],
      imports: [IconModule, ToastModule, ButtonModule]
    }).compileComponents();
    TestBed.overrideModule(ToastModule, {
      set: { entryComponents: [ToastComponent, TestToastComponent] }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestToastComponent);
    component = fixture.componentInstance;
    toastEle = fixture.debugElement.query(By.css('toast'));
    buttons = fixture.debugElement.queryAll(By.directive(Button));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('content should work', () => {
    expect(toastEle.nativeElement.querySelector('.am-toast-text-info').innerText).toContain('123', 'content is 123');
    component.content = '456';
    fixture.detectChanges();
    expect(toastEle.nativeElement.querySelector('.am-toast-text-info').innerText).toContain('456', 'content is 456');
    component.content = '';
    fixture.detectChanges();
    component.content = component.contentTpl;
    fixture.detectChanges();
    expect(toastEle.nativeElement.querySelector('.am-toast-text').innerText).toContain('contentTpl', 'content is 456');
  });

  it('iconType should work', () => {
    component.iconType = 'cross';
    fixture.detectChanges();
    expect(toastEle.nativeElement.querySelector('.am-icon').classList).toContain('am-icon-cross', 'content is 123');
    component.iconType = 'check';
    fixture.detectChanges();
    expect(toastEle.nativeElement.querySelector('.am-icon').classList).toContain('am-icon-check', 'content is 456');
  });

  it('mask should work', () => {
    expect(toastEle.nativeElement.classList).toContain('am-toast-mask', 'mask is true');
    component.mask = false;
    fixture.detectChanges();
    expect(toastEle.nativeElement.classList).toContain('am-toast-nomask', 'mask is false');
  });

  it('should showToast work', () => {
    const button = buttons[0].nativeElement;
    dispatchTouchEvent(button, 'touchend');
    fixture.detectChanges();
    toastEle1 = document.querySelector('toast');
    expect(toastEle1.querySelector('.am-toast-text-info').innerText).toContain(
      'This is a toast tips !!!',
      'showToast work'
    );
  });

  it('should showToastNoMask work', () => {
    const button = buttons[1].nativeElement;
    dispatchTouchEvent(button, 'touchend');
    fixture.detectChanges();
    toastEle1 = document.querySelector('toast');
    expect(toastEle1.querySelector('.am-toast-text-info').innerText).toContain(
      'Toast without mask !!!',
      'showToastNoMask work'
    );
  });

  it('should showCustomIcon work', () => {
    const button = buttons[2].nativeElement;
    dispatchTouchEvent(button, 'touchend');
    fixture.detectChanges();
    toastEle1 = document.querySelector('toast');
    expect(toastEle1.innerText).toContain('toast的内容', 'showCustomIcon work');
  });

  it('should successToast work', () => {
    const button = buttons[3].nativeElement;
    dispatchTouchEvent(button, 'touchend');
    fixture.detectChanges();
    toastEle1 = document.querySelector('toast');
    expect(toastEle1.querySelector('.am-toast-text-info').innerText).toContain('Load success !!!', 'successToast work');
  });

  it('should failToast work', () => {
    const button = buttons[4].nativeElement;
    dispatchTouchEvent(button, 'touchend');
    fixture.detectChanges();
    toastEle1 = document.querySelector('toast');
    expect(toastEle1.querySelector('.am-toast-text-info').innerText).toContain('Load failed !!!', 'failToast work');
  });

  it('should offline work', () => {
    const button = buttons[5].nativeElement;
    dispatchTouchEvent(button, 'touchend');
    fixture.detectChanges();
    toastEle1 = document.querySelector('toast');
    expect(toastEle1.querySelector('.am-toast-text-info').innerText).toContain(
      'Network connection failed !!!',
      'offline work'
    );
  });

  it('should loadingToast work', () => {
    const button = buttons[6].nativeElement;
    dispatchTouchEvent(button, 'touchend');
    fixture.detectChanges();
    toastEle1 = document.querySelector('toast');
    expect(toastEle1.querySelector('.am-toast-text-info').innerText).toContain('Loading...', 'loadingToast work');
  });
});

@Component({
  selector: 'test-toast',
  template: `
    <Toast [content]="content" [iconType]="iconType" [mask]="mask"></Toast>
    <div Button (onClick)="showToast()">text only</div>
    <div Button (onClick)="showToastNoMask()">without mask</div>
    <div Button (onClick)="showCustomIcon(content1)">custom content</div>
    <div Button (onClick)="successToast()">success</div>
    <div Button (onClick)="failToast()">fail</div>
    <div Button (onClick)="offline()">network failure</div>
    <div Button (onClick)="loadingToast()">loading</div>

    <ng-template #content1>
      <p>toast的内容</p>
      <p>toast的内容</p>
    </ng-template>

    <ng-template #contentTpl>
    contentTpl
    </ng-template>
  `,
  providers: [Toast]
})
export class TestToastComponent {
  content: any = '123';
  iconType = '';
  mask = true;

  @ViewChild('contentTpl')
  contentTpl: ViewChild;

  constructor(private _toast: Toast) {}

  showToast() {
    const toast = Toast.show('This is a toast tips !!!', 0);
    setTimeout(() => {
      Toast.hide();
    }, 3000);
  }

  showToastNoMask() {
    const toast = Toast.info('Toast without mask !!!', 4000, null, false);
  }

  showCustomIcon(event) {
    const toast = Toast.info(event);
  }

  successToast() {
    const toast = Toast.success('Load success !!!', 3000, () => {
      this.onClose();
    });
  }

  onClose() {
    console.log('success');
  }

  failToast() {
    const toast = Toast.fail('Load failed !!!', 1000);
  }

  offline() {
    const toast = Toast.offline('Network connection failed !!!', 1000);
  }

  loadingToast() {
    const toast = Toast.loading('Loading...', 3000, () => {
      console.log('Load complete !!!');
    });
  }
}