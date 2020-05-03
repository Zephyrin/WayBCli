import { TestBed } from '@angular/core/testing';

import { HaveService } from './have.service';

describe('HaveService', () => {
  let service: HaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
