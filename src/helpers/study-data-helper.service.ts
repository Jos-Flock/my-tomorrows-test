import { Injectable } from '@angular/core';
import {StudyService} from "../services/study.service";
import {Study} from "../models/study";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StudyDataHelperService {

  private studies$ = new BehaviorSubject<Study[]>([]);

  public currentStudies$ = this.studies$.asObservable();

  constructor(private readonly studyService: StudyService) {
    this.fetchData();
  }

  private fetchData(): void {
    this.studyService.list().subscribe((rows) =>
      this.studies$.next(rows.rows)
    );
  }
}
