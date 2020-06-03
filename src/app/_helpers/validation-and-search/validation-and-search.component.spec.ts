import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationAndSearchComponent } from './validation-and-search.component';

describe('ValidationAndSearchComponent', () => {
  let component: ValidationAndSearchComponent;
  let fixture: ComponentFixture<ValidationAndSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationAndSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationAndSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
