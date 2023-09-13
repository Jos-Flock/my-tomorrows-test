import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyCardComponent } from './study-card.component';

describe('StudyComponent', () => {
  let component: StudyCardComponent;
  let fixture: ComponentFixture<StudyCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudyCardComponent]
    });
    fixture = TestBed.createComponent(StudyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
