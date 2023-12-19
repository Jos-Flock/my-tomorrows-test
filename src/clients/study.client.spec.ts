import { StudyClient } from './study.client';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { STUDY_JSON } from '../test/models/study-test';

describe('StudyService', () => {
  let service: StudyClient;
  let httpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    // @ts-ignore
    httpClient = {
      get: jest.fn().mockReturnValue(
        of({
          nextPageToken: 'nextTokenParamToTest',
          studies: [STUDY_JSON, STUDY_JSON],
          totalCount: 2,
        }),
      ),
    };

    service = new StudyClient(httpClient);
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
        expect(mockedResult.studies.length).toBe(2);
        // first item
        expect(mockedResult.studies[0]).toBe(STUDY_JSON);
        expect(mockedResult.studies[1]).toBe(STUDY_JSON);
        done();
      });
    });
  });
});
