import { Injectable, OnDestroy } from '@angular/core';
import { internalizeStudy, StudyClient } from '../clients/study.client';
import { Study } from '../models/study';
import { BehaviorSubject, Observable, Subscription, takeWhile, timer } from 'rxjs';

const DEFAULT_POLLING_INTERVAL_MS = 5000; // 5 seconds
export const DEFAULT_STUDY_LIMIT = 10;

@Injectable({
  providedIn: 'root',
})
export class StudyService implements OnDestroy {
  private isPolling = false;
  private studies$ = new BehaviorSubject<Study[]>([]);
  private pollingStatus$ = new BehaviorSubject<'On' | 'Off'>('Off');
  private studiesList: Study[] = [];
  private settings: {
    studyLimit: number;
    pollingInterval: number;
  } = { studyLimit: DEFAULT_STUDY_LIMIT, pollingInterval: DEFAULT_POLLING_INTERVAL_MS };
  private nextPageToken: string | undefined = undefined;
  private pollingTimer!: Subscription;

  constructor(private readonly studyService: StudyClient) {}

  private fetchData(pageLimit: number = this.settings.studyLimit) {
    this.studyService.list(pageLimit, this.nextPageToken).subscribe(response => {
      if (response.nextPageToken !== null) {
        this.nextPageToken = response.nextPageToken;
      } else {
        // this is the last page, so stop polling if this is still running
        if (this.isPolling) {
          this.togglePolling();
        }
      }
      this.addStudyToStudiesList(response.studies.map(internalizeStudy));
    });
  }

  private addStudyToStudiesList(studies: Study[]): void {
    // can hold max this.settings.studyLimit (10)
    // set the current studiesList as starting point
    const newStudiesList: Study[] = this.studiesList;

    studies.forEach((study: Study) => {
      // check if there is room for another Study in the newStudiesList
      if (newStudiesList.length === this.settings.studyLimit) {
        // there is no room left, so remove one
        newStudiesList.shift();
      }
      newStudiesList.push(study);
    });
    // copy the newStudiesList into the studiesList
    this.studiesList = newStudiesList;

    this.studies$.next(newStudiesList);
  }

  private startPollingTimer(): void {
    this.pollingTimer = timer(0, this.settings.pollingInterval)
      .pipe(takeWhile(() => this.isPolling))
      .subscribe(() => {
        this.fetchData(1);
      });
  }

  public init(studyLimit: number, pollingIntervalMs: number = DEFAULT_POLLING_INTERVAL_MS): void {
    this.settings.studyLimit = studyLimit;
    this.settings.pollingInterval = pollingIntervalMs;
    this.fetchData();
  }

  public togglePolling(): void {
    this.isPolling = !this.isPolling;
    this.pollingStatus$.next(this.isPolling ? 'On' : 'Off');

    if (this.isPolling) {
      this.startPollingTimer();
    }
  }

  public getCurrentStudiesObservable(): Observable<Study[]> {
    return this.studies$.asObservable();
  }

  public getPollingStatusObservable(): Observable<'On' | 'Off'> {
    return this.pollingStatus$.asObservable();
  }

  ngOnDestroy() {
    this.studies$.complete();
    this.pollingStatus$.complete();
    this.pollingTimer.unsubscribe();
  }
}
