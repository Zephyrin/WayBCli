import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackpacksComponent } from './backpacks.component';

describe('BackpacksComponent', () => {
  let component: BackpacksComponent;
  let fixture: ComponentFixture<BackpacksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackpacksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackpacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
