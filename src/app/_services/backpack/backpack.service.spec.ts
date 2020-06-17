import { TestBed } from '@angular/core/testing';

import { BackpackHttpService } from './backpack.service';

describe('BackpackService', () => {
  let service: BackpackHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackpackHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
