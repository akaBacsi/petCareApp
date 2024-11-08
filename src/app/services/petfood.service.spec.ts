import { TestBed } from '@angular/core/testing';

import { PetfoodService } from './petfood.service';

describe('PetfoodService', () => {
  let service: PetfoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetfoodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
