import { StudyListComponent } from './study-list.component';
import { StudyService } from '../../services/study.service';
import { of, Subject, throwError } from 'rxjs';

describe('StudyListComponent', () => {
  let component: StudyListComponent;
  let studyService: jest.Mocked<StudyService>;

  let currentStudiesSubject: Subject<void>;
  let currentPollingSubject: Subject<boolean>;

  beforeEach(() => {
    currentStudiesSubject = new Subject<void>();
    currentPollingSubject = new Subject<boolean>();
    // @ts-ignore
    studyService = {
      setPolling: jest.fn(),
      getStudiesObservable: jest.fn().mockReturnValue(of(currentStudiesSubject)),
      getPollingObservable: jest.fn().mockReturnValue(of(currentPollingSubject)),
    };

    component = new StudyListComponent(studyService);
    component.ngOnInit();
  });

  it('should call setPolling', () => {
    component.handleToggleTimer();
    expect(studyService.setPolling).toHaveBeenCalledTimes(1);
  });

  it('should catch error when the server does not respond', () => {
    studyService.getStudiesObservable.mockImplementation(() => {
      throw new Error();
    });
    expect(studyService.getStudiesObservable).toThrow();
  });
});
