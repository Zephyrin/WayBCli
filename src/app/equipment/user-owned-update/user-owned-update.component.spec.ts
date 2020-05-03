import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOwnedUpdateComponent } from './user-owned-update.component';

describe('UserOwnedUpdateComponent', () => {
  let component: UserOwnedUpdateComponent;
  let fixture: ComponentFixture<UserOwnedUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserOwnedUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOwnedUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
