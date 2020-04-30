import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraFieldDefComponent } from './extra-field-def.component';

describe('ExtraFieldDefComponent', () => {
  let component: ExtraFieldDefComponent;
  let fixture: ComponentFixture<ExtraFieldDefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraFieldDefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraFieldDefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
