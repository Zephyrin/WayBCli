import { TestBed } from '@angular/core/testing';

import { BrandPaginationSearchService } from './brand-pagination-search.service';

describe('BrandPaginationSearchService', () => {
  let service: BrandPaginationSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandPaginationSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
