import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboPaginateComponent } from './combo-paginate.component';

describe('ComboPaginateComponent', () => {
  let component: ComboPaginateComponent;
  let fixture: ComponentFixture<ComboPaginateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComboPaginateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboPaginateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
