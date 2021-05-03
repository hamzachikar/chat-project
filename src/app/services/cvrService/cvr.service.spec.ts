import { TestBed } from '@angular/core/testing';

import { CvrService } from './cvr.service';

describe('CvrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CvrService = TestBed.get(CvrService);
    expect(service).toBeTruthy();
  });
});
