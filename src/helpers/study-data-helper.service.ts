import {Injectable, OnDestroy} from '@angular/core';
import {StudyService} from "../services/study.service";
import {Study} from "../models/study";
import {
  BehaviorSubject, concat,
  concatMap,
  filter,
  finalize,
  interval,
  map,
  Observable,
  of, repeat,
  Subject, switchMap,
  takeWhile,
  tap,
  timer
} from "rxjs";
import {cloneDeep} from "lodash";

const DEFAULT_POLLING_INTERVAL_MS: number = 5000; // 5 seconds
const DEFAULT_PROGRESS_INTERVAL_MS: number = 1000; // 1 second

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
    value: number,
    nextPageToken?: string,
  } = { studyLimit: 10, pollingInterval: DEFAULT_POLLING_INTERVAL_MS, value: 0 };

  public currentStudies$: Observable<Study[]> = this.studies$.asObservable();
  public currentPollingStatus$: Observable<boolean> = this.pollingStatus$.asObservable();
  public currentProgressPercentage$: Observable<number> = this.progressPercentage$.asObservable();

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
    console.log('addStudyToStudiesList START -> this.studiesList:', this.studiesList);
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

    console.log('addStudyToStudiesList END -> this.studiesList:', cloneDeep(this.studiesList));
    this.studies$.next(newStudiesList);
  }

  private startPollingTimer(): void {
    console.log('startTimer');
    timer(0, this.settings.pollingInterval).pipe(
      takeWhile(() => this.isRunning)
    ).subscribe(() => {
      console.log('polling');
      console.log('this.settings.nextPageToken:', this.settings.nextPageToken);
      this.fetchData(1);
    });
  }

  private startProgressTimer(): void {
    const pollingIntervalInSeconds = this.settings.pollingInterval / 1000;
    console.log('start progress timer');
    timer(0, DEFAULT_PROGRESS_INTERVAL_MS).pipe(
      takeWhile(() => this.isRunning),
      tap(() => this.settings.value = this.settings.value + 1),
      tap(() => {
        if (this.settings.value > pollingIntervalInSeconds) {
          this.settings.value = 0
        }
      })
    ).subscribe(() => {
      console.log('this.settings.value:', this.settings.value);
      console.log('this.settings.value in percent:', this.settings.value * (100 / (this.settings.pollingInterval / 1000)));
      this.progressPercentage$.next(this.settings.value * (100 / pollingIntervalInSeconds));
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
      // this.startProgressTimer();
      // this.startPollingTimerTest();
    }
  }

  /*******************************/

  // will emit whether or not data is currently loading.
  public dataLoadingSubject$ = new Subject<boolean>();

  // wrapper for the actual http reqeust that invokes datLoadingSubject before and after.
  private doRequest(): Observable<any> {
    // arbitrary value to start the pipe.
    return of(0).pipe(
      // notify load start
      tap(() => this.dataLoadingSubject$.next(true)),
      // wait for actual request.
      concatMap(() =>  of(this.fetchData(1))),
      // notify load end
      finalize(() => this.dataLoadingSubject$.next(false))
    )
  }

  // will emit the countdown, 5, 4, 3, ...
  public dataRequestTimeRemaining$ = new Subject<number>();

  // Creates an Observable that will count from interval to 0, then complete.
  private countDown(interval: number): Observable<number> {
    // timer() will emit an incrementing number each second
    return timer(0, 1000).pipe(
      takeWhile(() => this.isRunning),
      // i is emitted by timer(), basically the number of elapsed seconds.
      takeWhile((i) => i <= interval),
      // trigger output in other Observable
      tap((i) => this.dataRequestTimeRemaining$.next(interval - i)),
      // suppress any emission, we don't want them in the main pipe.
      filter(() => false)
    )
  }

  // wil emit if the user selects a different interval.
  public interval$ = new BehaviorSubject<number>(5);

  // Output is the loaded data.
  private data$ = this.interval$.pipe(
    switchMap((interval) => concat( // restart all, if interval changes
      this.countDown(interval),                     // first run countDown
      this.doRequest()                              // when countDown completes, start the request
      ).pipe(repeat({ delay: 0}))      // repeat countDown + request when finished
    )
  );

  private startPollingTimerTest(): void {
    // subscribe to everything
    // instead of logging you'd probably use an async-pipe
    this.dataLoadingSubject$.subscribe((loading) => console.log(loading ? 'loading' : 'not loading'));
    this.dataRequestTimeRemaining$.subscribe((t) => console.log(`time until request: ${t}s...`));
    this.data$.subscribe(console.log);
  }


  /*******************************/

  ngOnDestroy() {
    this.studies$.complete();
    this.pollingStatus$.complete();
    this.progressPercentage$.complete();
  }

}
