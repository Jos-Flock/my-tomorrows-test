import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {map, Observable } from "rxjs";
import {Study} from "../models/study";
import {ListResponse} from "../models/listResponse";

const API_BASE_URL: string = 'https://clinicaltrials.gov/api/v2';

@Injectable({
  providedIn: 'root'
})
export class StudyService {

  constructor(private readonly http: HttpClient) { }

  public list(pageSize: number, nextPageToken?: string): Observable<ListResponse<Study>> {
    const options = nextPageToken ? {
      params: new HttpParams().set('pageSize', pageSize).set('pageToken', nextPageToken)
    } : {
      params: new HttpParams().set('pageSize', pageSize)
    };
    return this.http.get(API_BASE_URL + '/studies', options).pipe(
      map((apiResult: any) => {
        return new ListResponse<Study>(apiResult.nextPageToken, Study.convertList(apiResult.studies))
      }));
  }
}
