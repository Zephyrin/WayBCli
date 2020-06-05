import { TestBed } from '@angular/core/testing';

import { UserPaginationSearchService } from './user-pagination-search.service';

describe('UserPaginationSearchService', () => {
  let service: UserPaginationSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPaginationSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
