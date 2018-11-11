import { TestBed, inject } from '@angular/core/testing';

import { NgxPhoneMaskService } from './ngx-phone-mask.service';

describe('NgxPhoneMaskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxPhoneMaskService]
    });
  });

  it('should be created', inject([NgxPhoneMaskService], (service: NgxPhoneMaskService) => {
    expect(service).toBeTruthy();
  }));
});
