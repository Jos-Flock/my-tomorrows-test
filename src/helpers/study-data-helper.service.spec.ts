import { TestBed } from '@angular/core/testing';

import { StudyDataHelperService } from './study-data-helper.service';

describe('StudyDataHelperService', () => {
  let service: StudyDataHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudyDataHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
