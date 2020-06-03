import { TestBed } from '@angular/core/testing';

import { EquipmentPaginationSearchService } from './equipment-pagination-search.service';

describe('EquipmentPaginationSearchService', () => {
  let service: EquipmentPaginationSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentPaginationSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
