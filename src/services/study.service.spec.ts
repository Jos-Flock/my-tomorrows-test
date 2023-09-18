import { StudyService } from './study.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { STUDY_JSON } from '../test/models/study-test';

describe('StudyService', () => {
  let service: StudyService;
  let httpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    // @ts-ignore
    httpClient = {
      get: jest.fn().mockReturnValue(
        of({
          nextPageToken: 'nextTokenParamToTest',
          studies: [STUDY_JSON, STUDY_JSON],
        }),
      ),
    };

    service = new StudyService(httpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('list', () => {
    const nextPageToken = 'nextTokenParamToTest';
    let params: HttpParams;

    it('should add pageSize param', done => {
      service.list(100).subscribe(() => {
        params = httpClient.get.mock.calls[0][1]?.params as HttpParams;
        const pageSizeValue = params.get('pageSize');
        const nextPageTokenValue = params.get('pageToken');

        expect(pageSizeValue).toBe('100');
        expect(nextPageTokenValue).toBeNull();
        done();
      });
    });

    it('should add nextPageToken param', done => {
      service.list(100, nextPageToken).subscribe(() => {
        params = httpClient.get.mock.calls[0][1]?.params as HttpParams;
        const pageSizeValue = params.get('pageSize');
        const nextPageTokenValue = (httpClient.get.mock.calls[0][1]?.params as HttpParams).get(
          'pageToken',
        );

        expect(pageSizeValue).toBe('100');
        expect(nextPageTokenValue).toBe(nextPageToken);
        done();
      });
    });

    it('should convert the response to a ListResponse', done => {
      service.list(100, nextPageToken).subscribe(mockedResult => {
        expect(mockedResult.nextPageToken).toBe(nextPageToken);
        expect(mockedResult.items.length).toBe(2);
        // first item
        expect(mockedResult.items[0].nctId).toBe(
          STUDY_JSON.protocolSection.identificationModule.nctId,
        );
        expect(mockedResult.items[0].briefTitle).toBe(
          STUDY_JSON.protocolSection.identificationModule.briefTitle,
        );
        expect(mockedResult.items[0].officialTitle).toBe(
          STUDY_JSON.protocolSection.identificationModule.officialTitle,
        );
        expect(mockedResult.items[0].overallStatus).toBe(
          STUDY_JSON.protocolSection.statusModule.overallStatus,
        );
        expect(mockedResult.items[0].briefSummary).toBe(
          STUDY_JSON.protocolSection.descriptionModule.briefSummary,
        );
        expect(mockedResult.items[0].detailedDescription).toBe(
          STUDY_JSON.protocolSection.descriptionModule.detailedDescription,
        );
        // second item
        expect(mockedResult.items[1].nctId).toBe(
          STUDY_JSON.protocolSection.identificationModule.nctId,
        );
        expect(mockedResult.items[1].briefTitle).toBe(
          STUDY_JSON.protocolSection.identificationModule.briefTitle,
        );
        expect(mockedResult.items[1].officialTitle).toBe(
          STUDY_JSON.protocolSection.identificationModule.officialTitle,
        );
        expect(mockedResult.items[1].overallStatus).toBe(
          STUDY_JSON.protocolSection.statusModule.overallStatus,
        );
        expect(mockedResult.items[1].briefSummary).toBe(
          STUDY_JSON.protocolSection.descriptionModule.briefSummary,
        );
        expect(mockedResult.items[1].detailedDescription).toBe(
          STUDY_JSON.protocolSection.descriptionModule.detailedDescription,
        );
        done();
      });
    });
  });
});
