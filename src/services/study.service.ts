import { Injectable } from '@angular/core';
import { internalizeStudy, StudyClient } from '../clients/study.client';
import { Study } from '../models/study';
import {
  BehaviorSubject,
  combineLatestWith,
  concat,
  filter,
  map,
  mergeAll,
  mergeMap,
  Observable,
  scan,
  timer,
} from 'rxjs';

const DEFAULT_POLLING_INTERVAL_MS = 5000; // 5 seconds
export const DEFAULT_STUDY_LIMIT = 10;

@Injectable({
  providedIn: 'root',
})
export class StudyService {
  private readonly studies$;
  private polling$ = new BehaviorSubject<boolean>(false);

  private nextPageToken: string | undefined = undefined;

  constructor(private readonly studyClient: StudyClient) {
    const poller = timer(0, DEFAULT_POLLING_INTERVAL_MS).pipe(
      combineLatestWith(this.polling$),
      filter(([_, polling]) => polling),
      mergeMap(() => this.fetchData(1)),
    );
    this.studies$ = concat(this.fetchData(), poller).pipe(
      scan((acc, cur) => [...acc, cur].slice(DEFAULT_STUDY_LIMIT * -1), [] as Study[]),
    );
  }

  private fetchData(pageLimit: number = DEFAULT_STUDY_LIMIT): Observable<Study> {
    return this.studyClient.list(pageLimit, this.nextPageToken).pipe(
      map(({ nextPageToken, studies }) => {
        if (nextPageToken !== undefined) {
          this.nextPageToken = nextPageToken;
        } else {
          this.setPolling(false);
        }
        return studies.map(internalizeStudy);
      }),
      mergeAll(),
    );
  }

  public setPolling(isPolling: boolean): void {
    this.polling$.next(isPolling);
  }

  public getStudiesObservable(): Observable<Study[]> {
    return this.studies$;
  }

  public getPollingObservable(): Observable<boolean> {
    return this.polling$.asObservable();
  }
}
