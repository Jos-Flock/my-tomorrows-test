import { DEFAULT_STUDY_LIMIT, StudyDataService } from './study-data.service';
import { StudyService } from './study.service';
import { of } from 'rxjs';
import { createTestListResponse } from '../test/models/list-response';
import { createTestStudy } from '../test/models/study-test';

describe('StudyDataHelperService', () => {
  let service: StudyDataService;
  let studyService: jest.Mocked<StudyService>;

  beforeEach(() => {
    // @ts-ignore
    studyService = {
      list: jest
        .fn()
        .mockReturnValue(of(createTestListResponse([createTestStudy(), createTestStudy()]))),
    };

    service = new StudyDataService(studyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchData', () => {
    it('should pass on the default pageLimit', () => {
      service.init(DEFAULT_STUDY_LIMIT);
      expect(studyService.list).toHaveBeenCalledWith(DEFAULT_STUDY_LIMIT, undefined);
    });

    it('should pass on the given pageLimit', () => {
      service.init(20);
      expect(studyService.list).toHaveBeenCalledWith(20, undefined);
    });
  });

  describe('addStudyToStudiesList', () => {
    it('should keep studies count === studyLimit', done => {
      studyService.list.mockReturnValue(
        of(
          createTestListResponse([createTestStudy(), createTestStudy('nieuwe'), createTestStudy()]),
        ),
      );
      service.init(2);

      service.getCurrentStudiesObservable().subscribe(result => {
        expect(result.length).toBe(2);
        done();
      });
    });

    it('should remove oldest study', done => {
      studyService.list.mockReturnValue(
        of(
          createTestListResponse([
            createTestStudy('new'),
            createTestStudy('newer'),
            createTestStudy('newest'),
          ]),
        ),
      );
      service.init(2);

      service.getCurrentStudiesObservable().subscribe(result => {
        expect(result[0].nctId).toBe('newer');
        expect(result[1].nctId).toBe('newest');
        done();
      });
    });
  });

  describe('startPollingTimer', () => {
    const msToRunTimer = 200;
    beforeEach(() => {
      jest.useFakeTimers(); // Turn on fake timers
      // Init the service with a shorter interval for speeding up unit testing and start the pollingTimer
      service.init(DEFAULT_STUDY_LIMIT, msToRunTimer);
      service.togglePolling();
    });

    it('should call studyService 3 times', () => {
      jest.advanceTimersByTime(msToRunTimer + 5); // make sure the timer is triggered once
      service.togglePolling(); // turn of the pollingTimer
      expect(studyService.list).toHaveBeenCalledTimes(3); // 1 for the service.init + 2 times for the pollingTimer
    });

    it('should call studyService twice if timer is stopped before first completion', () => {
      jest.advanceTimersByTime(msToRunTimer * 0.5); // make sure the timer is triggered once
      service.togglePolling(); // turn of the pollingTimer
      expect(studyService.list).toHaveBeenCalledTimes(2); // 1 for the service.init + 2 times for the pollingTimer
    });

    it('should automatically stop polling when last page is reached', done => {
      studyService.list
        .mockReturnValue(
          of(
            createTestListResponse([
              createTestStudy('new'),
              createTestStudy('newer'),
              createTestStudy('newest'),
            ]),
          ),
        )
        .mockReturnValue(
          of(
            createTestListResponse(
              [createTestStudy('new'), createTestStudy('newer'), createTestStudy('newest')],
              null,
            ),
          ),
        );

      jest.advanceTimersByTime(msToRunTimer + 5);
      expect(studyService.list).toHaveBeenCalledTimes(2); // 1 for the service.init + 1 for the pollingTimer
      service.getPollingStatusObservable().subscribe(result => {
        expect(result).toBe('Off'); // the isPolling should be false
        done();
      });
    });
  });

  describe('togglePolling', () => {
    it('should toggle isRunning', done => {
      service.init(DEFAULT_STUDY_LIMIT);
      service.togglePolling();
      service.getPollingStatusObservable().subscribe(result => {
        expect(result).toBe('On');
        done();
      });
    });
  });
});
