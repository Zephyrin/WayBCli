import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentValidatorComponent } from './equipment-validator.component';

describe('EquipmentValidatorComponent', () => {
  let component: EquipmentValidatorComponent;
  let fixture: ComponentFixture<EquipmentValidatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentValidatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
