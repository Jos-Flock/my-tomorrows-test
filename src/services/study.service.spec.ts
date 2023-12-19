import { DEFAULT_STUDY_LIMIT, StudyService } from './study.service';
import { StudyClient } from '../clients/study.client';
import { of } from 'rxjs';
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

  afterEach(() => service.ngOnDestroy());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchData', () => {
    it('should pass on the default pageLimit', () => {
      expect(studyClient.list).toHaveBeenCalledWith(DEFAULT_STUDY_LIMIT, undefined);
    });
  });
  describe('timer', () => {
    const msToRunTimer = 200;
    beforeEach(() => {
      jest.useFakeTimers({ timerLimit: msToRunTimer }); // Turn on fake timers
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
            nextPageToken: undefined,
            studies: [createTestStudy('new'), createTestStudy('newer'), createTestStudy('newest')],
            totalCount: 3,
          }),
        );

      jest.advanceTimersByTime(msToRunTimer + 5);
      expect(studyClient.list).toHaveBeenCalledTimes(1);
      service.getPollingStatusObservable().subscribe(result => {
        expect(result).toBe(false); // the isPolling should be false
        done();
      });
    });
  });

  describe('togglePolling', () => {
    it('should setPolling to true', done => {
      service.setPolling(true);
      service.getPollingStatusObservable().subscribe(result => {
        expect(result).toBeTruthy();
        done();
      });
    });

    it('should setPolling to false', done => {
      service.setPolling(false);
      service.getPollingStatusObservable().subscribe(result => {
        expect(result).toBeFalsy();
        done();
      });
    });
  });
});
