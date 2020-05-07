import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoryUpdateComponent } from './sub-category-update.component';

describe('SubCategoryUpdateComponent', () => {
  let component: SubCategoryUpdateComponent;
  let fixture: ComponentFixture<SubCategoryUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubCategoryUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoryUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
