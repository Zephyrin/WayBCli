import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackpackComponent } from './backpack.component';

describe('BackpackComponent', () => {
  let component: BackpackComponent;
  let fixture: ComponentFixture<BackpackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackpackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackpackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
