import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable } from "rxjs";
import {Study} from "../models/study";
import {Rows} from "../models/Rows";

const API_BASE_URL: string = 'https://clinicaltrials.gov/api/v2';

@Injectable({
  providedIn: 'root'
})
export class StudyService {

  constructor(private readonly http: HttpClient) { }

  public list(): Observable<Rows<Study>> {
    return this.http.get(API_BASE_URL + '/studies').pipe(
      map((apiResult: any) => {
        return new Rows<Study>(apiResult.totalCount, Study.convertList(apiResult.studies))
      }));
  }
}
