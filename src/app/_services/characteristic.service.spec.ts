import { TestBed } from '@angular/core/testing';

import { CharacteristicService } from './characteristic.service';

describe('CharacteristicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CharacteristicService = TestBed.get(CharacteristicService);
    expect(service).toBeTruthy();
  });
});
