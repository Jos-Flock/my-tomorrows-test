import {Component, Input} from '@angular/core';
import {Study} from "../../models/study";

@Component({
  selector: 'app-study-card',
  templateUrl: './study-card.component.html',
  styleUrls: ['./study-card.component.scss']
})
export class StudyCardComponent {

  @Input() study: Study;

  constructor() {
    this.study = {} as Study;
  }

}
