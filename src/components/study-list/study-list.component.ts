import { Component, OnInit } from '@angular/core';
import { StudyService } from '../../services/study.service';
import { Subject } from 'rxjs';
import { Study } from '../../models/study';

@Component({
  selector: 'app-study-list',
  templateUrl: './study-list.component.html',
  providers: [StudyService],
})
export class StudyListComponent implements OnInit {
  public studiesSubject$: Subject<Study[]> = new Subject();
  public isPolling = false;

  constructor(private readonly studyDataHelperService: StudyService) {}

  ngOnInit(): void {
    this.studyDataHelperService
      .getCurrentStudiesObservable()
      .subscribe(rows => this.studiesSubject$.next(rows));
    this.studyDataHelperService
      .getPollingStatusObservable()
      .subscribe(newStatus => (this.isPolling = newStatus));
  }

  handleToggleTimer(): void {
    this.studyDataHelperService.setPolling(!this.isPolling);
  }
}
