import { TestBed } from '@angular/core/testing';

import { BackpacksPaginationSearchService } from './backpacks-pagination-search.service';

describe('BackpackPaginationSearchService', () => {
  let service: BackpacksPaginationSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackpacksPaginationSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
