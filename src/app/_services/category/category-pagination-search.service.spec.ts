import { TestBed } from '@angular/core/testing';

import { CategoryPaginationSearchService } from './category-pagination-search.service';

describe('CategoryPaginationSearchService', () => {
  let service: CategoryPaginationSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryPaginationSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
