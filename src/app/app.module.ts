import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {StudyListComponent} from "../components/study-list/study-list.component";
import {StudyComponent} from "../components/study/study.component";

@NgModule({
  declarations: [
    AppComponent,
    StudyListComponent,
    StudyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
