import {Component, OnInit} from '@angular/core';
import {Study} from "../models/study";
import {StudyDataHelperService} from "../helpers/study-data-helper.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public studies: Study[] = [];

  constructor(private readonly studyService: StudyDataHelperService) {
  }

  ngOnInit(): void {
    this.studyService.currentStudies$.subscribe(rows => this.studies = rows )
  }

}
