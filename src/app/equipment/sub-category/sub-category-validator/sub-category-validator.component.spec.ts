import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryValidatorComponent } from './sub-category-validator.component';

describe('SubCategoryValidatorComponent', () => {
  let component: SubCategoryValidatorComponent;
  let fixture: ComponentFixture<SubCategoryValidatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubCategoryValidatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoryValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
