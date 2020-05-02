import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOwnedComponent } from './user-owned.component';

describe('UserOwnedComponent', () => {
  let component: UserOwnedComponent;
  let fixture: ComponentFixture<UserOwnedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserOwnedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOwnedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
