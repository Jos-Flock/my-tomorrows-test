import { StudyListComponent } from './study-list.component';
import { StudyService } from '../../services/study.service';
import { of, Subject } from 'rxjs';

describe('StudyListComponent', () => {
  let component: StudyListComponent;
  let studyDataHelperService: jest.Mocked<StudyService>;

  let currentStudiesSubject: Subject<void>;
  let currentPollingSubject: Subject<boolean>;

  beforeEach(() => {
    currentStudiesSubject = new Subject<void>();
    currentPollingSubject = new Subject<boolean>();
    // @ts-ignore
    studyDataHelperService = {
      setPolling: jest.fn(),
      getCurrentStudiesObservable: jest.fn().mockReturnValue(of(currentStudiesSubject)),
      getPollingStatusObservable: jest.fn().mockReturnValue(of(currentPollingSubject)),
    };

    component = new StudyListComponent(studyDataHelperService);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setPolling', () => {
    component.handleToggleTimer();
    expect(studyDataHelperService.setPolling).toHaveBeenCalledTimes(1);
  });
});
