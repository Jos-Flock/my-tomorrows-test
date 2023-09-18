import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { StudyListComponent } from './components/study-list/study-list.component';
import { StudyCardComponent } from './components/study-card/study-card.component';
import { StatusComponent } from './components/status/status.component';

@NgModule({
  declarations: [AppComponent, StudyListComponent, StudyCardComponent, StatusComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
