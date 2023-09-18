import {Component, OnInit} from '@angular/core';
import {StudyDataHelperService} from "../../helpers/study-data-helper.service";
import {Study} from "../../models/study";

@Component({
  selector: 'app-study-list',
  templateUrl: './study-list.component.html',
  providers: [StudyDataHelperService],
  styleUrls: ['./study-list.component.scss']
})
export class StudyListComponent implements OnInit {

  private limit: number = 10;

  public studies: Study[] = [];

  constructor(private readonly studyDataHelperService: StudyDataHelperService) {
  }

  ngOnInit(): void {
    this.studyDataHelperService.init(this.limit);

    this.studyDataHelperService.currentStudies$.subscribe(rows => this.studies = rows )
  }

  handleClick(): void {
    this.studyDataHelperService.nextPage();
  }

}
