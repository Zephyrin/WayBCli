import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackpackModalComponent } from './backpack-modal.component';

describe('BackpackModalComponent', () => {
  let component: BackpackModalComponent;
  let fixture: ComponentFixture<BackpackModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackpackModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackpackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
