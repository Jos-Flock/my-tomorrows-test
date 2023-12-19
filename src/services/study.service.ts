import { Injectable, OnDestroy } from '@angular/core';
import { internalizeStudy, StudyClient } from '../clients/study.client';
import { Study } from '../models/study';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  flatMap,
  map,
  Observable,
  scan,
  Subject,
  timer,
} from 'rxjs';

const DEFAULT_POLLING_INTERVAL_MS = 5000; // 5 seconds
export const DEFAULT_STUDY_LIMIT = 10;

@Injectable({
  providedIn: 'root',
})
export class StudyService implements OnDestroy {
  private study$ = new Subject<Study>();
  private timer$ = timer(0, DEFAULT_POLLING_INTERVAL_MS);
  private polling$ = new BehaviorSubject<boolean>(false);
  private nextPageToken: string | undefined = undefined;

  constructor(private readonly studyClient: StudyClient) {
    this.fetchData().subscribe(res => res.forEach(study => this.study$.next(study)));
    combineLatest(this.timer$, this.polling$)
      .pipe(
        filter(([_, polling]) => polling),
        flatMap(() => this.fetchData(1)),
      )
      .subscribe(res => this.study$.next(res[0]));
  }

  private fetchData(pageLimit: number = DEFAULT_STUDY_LIMIT): Observable<Study[]> {
    return this.studyClient.list(pageLimit, this.nextPageToken).pipe(
      map(res => {
        this.nextPageToken = res.nextPageToken;
        return res.studies.map(study => internalizeStudy(study));
      }),
    );
  }

  public setPolling(isPolling: boolean): void {
    this.polling$.next(isPolling);
  }

  public getCurrentStudiesObservable(): Observable<Study[]> {
    return this.study$.pipe(
      scan((acc, cur) => [...acc, cur].slice(DEFAULT_STUDY_LIMIT * -1), [] as Study[]),
    );
  }

  public getPollingStatusObservable(): Observable<boolean> {
    return this.polling$.asObservable();
  }

  ngOnDestroy() {
    this.study$.complete();
    this.polling$.complete();
  }
}
