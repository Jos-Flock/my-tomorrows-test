import { Component, OnInit } from '@angular/core';
import { StudyService } from '../../services/study.service';
import { catchError, Subject } from 'rxjs';
import { Study } from '../../models/study';

@Component({
  selector: 'app-study-list',
  templateUrl: './study-list.component.html',
  providers: [StudyService],
})
export class StudyListComponent implements OnInit {
  public studiesSubject$: Subject<Study[]> = new Subject();
  public isPolling = false;
  public errorMessage?: string;

  constructor(private readonly studyService: StudyService) {}

  ngOnInit(): void {
    this.studyService
      .getStudiesObservable()
      .pipe(
        catchError((_, caught) => {
          this.errorMessage = 'Unable to fetch studies from server.';
          return caught;
        }),
      )
      .subscribe(rows => this.studiesSubject$.next(rows));
    this.studyService.getPollingObservable().subscribe(newStatus => (this.isPolling = newStatus));
  }

  handleToggleTimer(): void {
    this.studyService.setPolling(!this.isPolling);
  }
}
