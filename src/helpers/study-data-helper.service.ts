import {Injectable, OnDestroy} from '@angular/core';
import {StudyService} from "../services/study.service";
import {Study} from "../models/study";
import {
  BehaviorSubject,
  Observable,
  Subscription,
  takeWhile,
  timer
} from "rxjs";
import {cloneDeep} from "lodash";

const DEFAULT_POLLING_INTERVAL_MS: number = 5000; // 5 seconds
export const DEFAULT_STUDY_LIMIT: number = 10;

@Injectable({
  providedIn: 'root'
})
export class StudyDataHelperService implements OnDestroy {

  private isRunning: boolean = false;
  private studies$ = new BehaviorSubject<Study[]>([]);
  private progressPercentage$ = new BehaviorSubject<number>(0);
  private pollingStatus$ = new BehaviorSubject<boolean>(this.isRunning);
  private studiesList: Study[] = [];
  private settings: {
    studyLimit: number,
    pollingInterval: number,
    nextPageToken?: string,
  } = { studyLimit: DEFAULT_STUDY_LIMIT, pollingInterval: DEFAULT_POLLING_INTERVAL_MS};
  private pollingTimer!: Subscription;

  constructor(private readonly studyService: StudyService) {
  }

  private fetchData(pageLimit: number = this.settings.studyLimit) {
    this.studyService.list(pageLimit, this.settings?.nextPageToken).subscribe((response) => {
      if (response.nextPageToken) {
        this.settings.nextPageToken = response.nextPageToken;
      }
      this.addStudyToStudiesList(response.items);
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
    // TODO: Uitzoeken of de timer() zelf destroyed?
    this.pollingTimer = timer(0, this.settings.pollingInterval).pipe(
      takeWhile(() => this.isRunning)
    ).subscribe(() => {
      this.fetchData(1);
    });
  }

  public init(studyLimit: number, pollingIntervalMs: number = DEFAULT_POLLING_INTERVAL_MS): void {
    this.settings.studyLimit = studyLimit;
    this.settings.pollingInterval = pollingIntervalMs;
    this.fetchData();
  }

  public togglePolling(): void {
    this.isRunning = !this.isRunning;
    this.pollingStatus$.next(this.isRunning);

    if (this.isRunning) {
      this.startPollingTimer();
    }
  }

  public getCurrentStudiesObservable(): Observable<Study[]> {
    return this.studies$.asObservable();
  }

  public getPollingStatusObservable(): Observable<boolean> {
    return this.pollingStatus$.asObservable();
  }

  ngOnDestroy() {
    this.studies$.complete();
    this.pollingStatus$.complete();
    this.progressPercentage$.complete();
    this.pollingTimer.unsubscribe();
  }

}
