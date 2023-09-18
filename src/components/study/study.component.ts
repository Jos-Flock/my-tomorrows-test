import {Component, Input} from '@angular/core';
import {Study} from "../../models/study";

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent {

  @Input() study: Study;

  constructor() {
    this.study = {} as Study;
  }

}
