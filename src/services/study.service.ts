import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Study } from '../models/study';
import { ListResponse } from '../models/listResponse';
import { PagedStudies } from '../models/external-api/pagedStudies';

const API_BASE_URL = 'https://clinicaltrials.gov/api/v2';

@Injectable({
  providedIn: 'root',
})
export class StudyService {
  constructor(private readonly http: HttpClient) {}

  public list(pageSize: number, nextPageToken?: string): Observable<ListResponse<Study>> {
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.append('pageSize', pageSize);
    if (nextPageToken) {
      httpParams = httpParams.append('pageToken', nextPageToken);
    }
    return this.http.get<PagedStudies>(API_BASE_URL + '/studies', { params: httpParams }).pipe(
      map(apiResult => {
        return new ListResponse<Study>(
          apiResult.nextPageToken,
          Study.convertList(apiResult.studies),
        );
      }),
    );
  }
}
