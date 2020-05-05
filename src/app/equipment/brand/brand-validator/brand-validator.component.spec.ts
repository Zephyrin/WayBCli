import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandValidatorComponent } from './brand-validator.component';

describe('BrandValidatorComponent', () => {
  let component: BrandValidatorComponent;
  let fixture: ComponentFixture<BrandValidatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandValidatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
