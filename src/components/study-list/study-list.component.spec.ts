import { StudyListComponent } from './study-list.component';
import { StudyDataService } from '../../services/study-data.service';
import { of, Subject } from 'rxjs';

describe('StudyListComponent', () => {
  let component: StudyListComponent;
  let studyDataHelperService: jest.Mocked<StudyDataService>;

  let currentStudiesSubject: Subject<void>;
  let currentPollingSubject: Subject<boolean>;

  beforeEach(() => {
    currentStudiesSubject = new Subject<void>();
    currentPollingSubject = new Subject<boolean>();
    // @ts-ignore
    studyDataHelperService = {
      init: jest.fn(),
      togglePolling: jest.fn(),
      getCurrentStudiesObservable: jest.fn().mockReturnValue(of(currentStudiesSubject)),
      getPollingStatusObservable: jest.fn().mockReturnValue(of(currentPollingSubject)),
    };

    component = new StudyListComponent(studyDataHelperService);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init the data helper service', () => {
    expect(studyDataHelperService.init).toHaveBeenCalledTimes(1);
    expect(studyDataHelperService.init).toHaveBeenCalledWith(10);
  });

  it('should call togglePolling', () => {
    component.handleToggleTimer();
    expect(studyDataHelperService.togglePolling).toHaveBeenCalledTimes(1);
  });
});
