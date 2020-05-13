import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacteristicValidatorComponent } from './characteristic-validator.component';

describe('CharacteristicValidatorComponent', () => {
  let component: CharacteristicValidatorComponent;
  let fixture: ComponentFixture<CharacteristicValidatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacteristicValidatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacteristicValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
