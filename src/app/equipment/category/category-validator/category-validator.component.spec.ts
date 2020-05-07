import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryValidatorComponent } from './category-validator.component';

describe('CategoryValidatorComponent', () => {
  let component: CategoryValidatorComponent;
  let fixture: ComponentFixture<CategoryValidatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryValidatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
