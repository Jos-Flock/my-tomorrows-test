import { DEFAULT_STUDY_LIMIT, StudyService } from './study.service';
import { StudyClient } from '../clients/study.client';
import { of } from 'rxjs';
import { createTestListResponse } from '../test/models/list-response';
import { createTestStudy } from '../test/models/study-test';

describe('StudyHelperService', () => {
  let service: StudyService;
  let studyClient: jest.Mocked<StudyClient>;

  beforeEach(() => {
    // @ts-ignore
    studyClient = {
      list: jest.fn().mockReturnValue(
        of({
          nextPageToken: 'nextPageToken',
          studies: [createTestStudy(), createTestStudy()],
          totalCount: 2,
        }),
      ),
    };

    service = new StudyService(studyClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchData', () => {
    it('should pass on the default pageLimit', () => {
      service.init(DEFAULT_STUDY_LIMIT);
      expect(studyClient.list).toHaveBeenCalledWith(DEFAULT_STUDY_LIMIT, undefined);
    });

    it('should pass on the given pageLimit', () => {
      service.init(20);
      expect(studyClient.list).toHaveBeenCalledWith(20, undefined);
    });
  });

  describe('addStudyToStudiesList', () => {
    it('should keep studies count === studyLimit', done => {
      studyClient.list.mockReturnValue(
        of({
          nextPageToken: 'nextPageToken',
          studies: [createTestStudy(), createTestStudy('nieuwe'), createTestStudy()],
          totalCount: 3,
        }),
      );
      service.init(2);

      service.getCurrentStudiesObservable().subscribe(result => {
        expect(result.length).toBe(2);
        done();
      });
    });

    it('should remove oldest study', done => {
      studyClient.list.mockReturnValue(
        of({
          nextPageToken: 'nextPageToken',
          studies: [createTestStudy('new'), createTestStudy('newer'), createTestStudy('newest')],
          totalCount: 3,
        }),
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
      expect(studyClient.list).toHaveBeenCalledTimes(3); // 1 for the service.init + 2 times for the pollingTimer
    });

    it('should call studyService twice if timer is stopped before first completion', () => {
      jest.advanceTimersByTime(msToRunTimer * 0.5); // make sure the timer is triggered once
      service.togglePolling(); // turn of the pollingTimer
      expect(studyClient.list).toHaveBeenCalledTimes(2); // 1 for the service.init + 2 times for the pollingTimer
    });

    it('should automatically stop polling when last page is reached', done => {
      studyClient.list
        .mockReturnValue(
          of({
            nextPageToken: 'nextPageToken',
            studies: [createTestStudy('new'), createTestStudy('newer'), createTestStudy('newest')],
            totalCount: 3,
          }),
        )
        .mockReturnValue(
          of({
            nextPageToken: null,
            studies: [createTestStudy('new'), createTestStudy('newer'), createTestStudy('newest')],
            totalCount: 3,
          }),
        );

      jest.advanceTimersByTime(msToRunTimer + 5);
      expect(studyClient.list).toHaveBeenCalledTimes(2); // 1 for the service.init + 1 for the pollingTimer
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
