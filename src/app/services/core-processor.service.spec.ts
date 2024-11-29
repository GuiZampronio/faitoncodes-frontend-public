import { TestBed } from '@angular/core/testing';

import { CoreProcessorService } from './core-processor.service';

describe('CoreProcessorService', () => {
  let service: CoreProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
