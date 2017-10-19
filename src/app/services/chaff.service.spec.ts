import { TestBed, inject } from '@angular/core/testing';

import { ChaffService } from './chaff.service';

describe('ChaffService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChaffService]
    });
  });

  it('should be created', inject([ChaffService], (service: ChaffService) => {
    expect(service).toBeTruthy();
  }));
});
