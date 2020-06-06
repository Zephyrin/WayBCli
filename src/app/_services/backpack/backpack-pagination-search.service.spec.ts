import { TestBed } from '@angular/core/testing';

import { BackpackPaginationSearchService } from './backpack-pagination-search.service';

describe('BackpackPaginationSearchService', () => {
  let service: BackpackPaginationSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackpackPaginationSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
