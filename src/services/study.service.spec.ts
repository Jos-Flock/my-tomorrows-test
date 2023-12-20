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

  describe('fetchData', () => {
    it('should be called initially on the default pageLimit', () => {
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

      service.getStudiesObservable().subscribe();

      service.setPolling(true);
      jest.advanceTimersByTime(msToRunTimer);

      service.getPollingObservable().subscribe(result => {
        expect(result).toBe(false);
        expect(studyClient.list).toHaveBeenCalledTimes(2);
        done();
      });
    });
  });

  describe('togglePolling', () => {
    it('should setPolling to true', done => {
      service.setPolling(true);
      service.getPollingObservable().subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should setPolling to false', done => {
      service.setPolling(false);
      service.getPollingObservable().subscribe(result => {
        expect(result).toBe(false);
        done();
      });
    });
  });
});
