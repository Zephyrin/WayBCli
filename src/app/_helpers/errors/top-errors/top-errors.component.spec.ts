import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopErrorsComponent } from './top-errors.component';

describe('TopErrorsComponent', () => {
  let component: TopErrorsComponent;
  let fixture: ComponentFixture<TopErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopErrorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
