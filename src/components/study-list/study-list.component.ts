import {Component, OnInit} from '@angular/core';
import {StudyDataHelperService} from "../../helpers/study-data-helper.service";
import {Study} from "../../models/study";
import {Subject} from "rxjs";

@Component({
  selector: 'app-study-list',
  templateUrl: './study-list.component.html',
  providers: [StudyDataHelperService],
  styleUrls: ['./study-list.component.scss']
})
export class StudyListComponent implements OnInit {

  private limit: number = 10;

  public studiesSubject: Subject<Study[]> = new Subject();
  public pollingStatus: boolean = false;

  constructor(private readonly studyDataHelperService: StudyDataHelperService) {
  }

  ngOnInit(): void {
    this.studyDataHelperService.init(this.limit);
    this.studyDataHelperService.getCurrentStudiesObservable().subscribe(
      rows => this.studiesSubject.next(rows)
    );
    this.studyDataHelperService.getPollingStatusObservable().subscribe(
      status => this.pollingStatus = status
    );
  }

  handleToggleTimer(): void {
    this.studyDataHelperService.togglePolling();
  }
}
