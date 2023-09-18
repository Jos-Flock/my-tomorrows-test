import { Injectable } from '@angular/core';
import {StudyService} from "../services/study.service";
import {Study} from "../models/study";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StudyDataHelperService {

  private studies$ = new BehaviorSubject<Study[]>([]);
  private settings: {
    limit: number,
    nextPageToken?: string,
  } = { limit: 10 };

  public currentStudies$ = this.studies$.asObservable();

  constructor(private readonly studyService: StudyService) {

  }

  private fetchData(): void {
    this.studyService.list(this.settings.limit, this.settings?.nextPageToken).subscribe((rows) => {
      if (rows.nextPageToken) {
        this.settings.nextPageToken = rows.nextPageToken;
      }
      this.studies$.next(rows.items)
    });
  }

  public init(limit: number): void {
    this.settings.limit = limit;
    this.fetchData();
  }

  public nextPage(): void {
    this.fetchData();
  }
}
