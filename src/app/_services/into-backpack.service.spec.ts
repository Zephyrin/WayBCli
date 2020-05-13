import { TestBed } from '@angular/core/testing';

import { IntoBackpackService } from './into-backpack.service';

describe('IntoBackpackService', () => {
  let service: IntoBackpackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntoBackpackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
