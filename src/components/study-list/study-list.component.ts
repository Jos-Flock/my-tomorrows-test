import { Component, OnInit } from '@angular/core';
import { StudyService } from '../../services/study.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Study } from '../../models/study';

@Component({
  selector: 'app-study-list',
  templateUrl: './study-list.component.html',
  providers: [StudyService],
})
export class StudyListComponent implements OnInit {
  private limit = 10;

  public studiesSubject$: Subject<Study[]> = new Subject();
  public pollingStatusSubject$: Subject<string> = new BehaviorSubject('Off');

  constructor(private readonly studyDataHelperService: StudyService) {}

  ngOnInit(): void {
    this.studyDataHelperService.init(this.limit);
    this.studyDataHelperService
      .getCurrentStudiesObservable()
      .subscribe(rows => this.studiesSubject$.next(rows));
    this.studyDataHelperService
      .getPollingStatusObservable()
      .subscribe(newStatus => this.pollingStatusSubject$.next(newStatus));
  }

  handleToggleTimer(): void {
    this.studyDataHelperService.togglePolling();
  }
}
