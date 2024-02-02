import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddChannelAddUserComponent } from './dialog-add-channel-add-user.component';

describe('DialogAddChannelAddUserComponent', () => {
  let component: DialogAddChannelAddUserComponent;
  let fixture: ComponentFixture<DialogAddChannelAddUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAddChannelAddUserComponent]
    });
    fixture = TestBed.createComponent(DialogAddChannelAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
