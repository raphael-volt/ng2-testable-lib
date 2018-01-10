import { TestBed, inject } from '@angular/core/testing';

import { SampleService } from './sample.service';

describe('SampleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SampleService]
    });
  });

  it('should inject', inject([SampleService], (service: SampleService) => {
    expect(service).toBeTruthy();
  }));
  
  it("should have a name 'SampleService'", inject([SampleService], (service: SampleService) => {
    expect(service.name).toEqual('SampleService')
  }));
});
