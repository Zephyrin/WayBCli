import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentHelpComponent } from './equipment-help.component';

describe('EquipmentHelpComponent', () => {
  let component: EquipmentHelpComponent;
  let fixture: ComponentFixture<EquipmentHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
