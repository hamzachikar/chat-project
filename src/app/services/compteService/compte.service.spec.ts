import { TestBed } from '@angular/core/testing';

import { CompteService } from './compte.service';

describe('CompteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompteService = TestBed.get(CompteService);
    expect(service).toBeTruthy();
  });
});
