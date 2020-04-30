import { TestBed } from '@angular/core/testing';

import { ExtraFieldDefService } from './extra-field-def.service';

describe('ExtraFieldDefService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExtraFieldDefService = TestBed.get(ExtraFieldDefService);
    expect(service).toBeTruthy();
  });
});
