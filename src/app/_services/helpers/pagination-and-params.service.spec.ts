import { TestBed } from '@angular/core/testing';

import { PaginationAndParamsService } from './pagination-and-params.service';

describe('PaginationService', () => {
  let service: PaginationAndParamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginationAndParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
