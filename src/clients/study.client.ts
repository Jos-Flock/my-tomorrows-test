import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OVERALL_STATUS, Study } from '../models/study';
import { PagedStudies } from '../models/external-api/pagedStudies';
import { Study as ApiStudy } from '../models/external-api/study';
import { IdentificationModule } from '../models/external-api/identificationModule';
import { StatusModule } from '../models/external-api/statusModule';
import { Status } from '../models/external-api/status';
import { DescriptionModule } from '../models/external-api/descriptionModule';

const API_BASE_URL = 'https://clinicaltrials.gov/api/v2';

@Injectable({
  providedIn: 'root',
})
export class StudyClient {
  constructor(private readonly http: HttpClient) {}

  public list(pageSize: number, nextPageToken?: string): Observable<PagedStudies> {
    let httpParams: HttpParams = new HttpParams({
      fromObject: {
        pageSize,
      },
    });
    if (nextPageToken) {
      httpParams = httpParams.append('pageToken', nextPageToken);
    }
    return this.http.get<PagedStudies>(API_BASE_URL + '/studies', { params: httpParams });
  }
}

export function internalizeStudy(apiStudy: ApiStudy): Study {
  const identificationModule: IdentificationModule = apiStudy?.protocolSection
    ?.identificationModule as IdentificationModule;
  const statusModule: StatusModule = apiStudy?.protocolSection?.statusModule as StatusModule;
  const overallStatus: OVERALL_STATUS | Status = statusModule.overallStatus ?? 'UNKNOWN';
  const descriptionModule: DescriptionModule = apiStudy?.protocolSection
    ?.descriptionModule as DescriptionModule;
  return {
    nctId: identificationModule.nctId,
    briefTitle: identificationModule.briefTitle,
    officialTitle: identificationModule.officialTitle,
    overallStatus: overallStatus,
    briefSummary: descriptionModule.briefSummary,
    detailedDescription: descriptionModule.detailedDescription,
  };
}
