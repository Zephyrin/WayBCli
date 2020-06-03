import { TestBed } from '@angular/core/testing';

import { ValidationAndSearchService } from './validation-and-search.service';

describe('ValidationAndSearchService', () => {
  let service: ValidationAndSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationAndSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
