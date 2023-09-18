import { Component, OnInit } from '@angular/core';
import { StudyDataService } from '../../services/study-data.service';
import { Study } from '../../models/study';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-study-list',
  templateUrl: './study-list.component.html',
  providers: [StudyDataService],
})
export class StudyListComponent implements OnInit {
  private limit = 10;

  public studiesSubject: Subject<Study[]> = new Subject();
  public pollingStatus = false;

  constructor(private readonly studyDataHelperService: StudyDataHelperService) {}

  ngOnInit(): void {
    this.studyDataHelperService.init(this.limit);
    this.studyDataHelperService
      .getCurrentStudiesObservable()
      .subscribe(rows => this.studiesSubject.next(rows));
    this.studyDataHelperService
      .getPollingStatusObservable()
      .subscribe(status => (this.pollingStatus = status));
  }

  handleToggleTimer(): void {
    this.studyDataHelperService.togglePolling();
  }
}
