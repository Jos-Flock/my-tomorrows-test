import { StudyService } from './study.service';
import {HttpClient} from "@angular/common/http";

describe('StudyService', () => {
  let service: StudyService;
  let httpService: jest.Mocked<HttpClient>

  beforeEach(() => {
    service = new StudyService(httpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
