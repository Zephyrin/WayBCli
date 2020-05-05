import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacteristicUpdateComponent } from './characteristic-update.component';

describe('CharacteristicUpdateComponent', () => {
  let component: CharacteristicUpdateComponent;
  let fixture: ComponentFixture<CharacteristicUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacteristicUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacteristicUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
