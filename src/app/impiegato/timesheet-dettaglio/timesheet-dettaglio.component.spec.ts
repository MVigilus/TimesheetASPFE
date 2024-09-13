import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetDettaglioComponent } from './timesheet-dettaglio.component';

describe('TimesheetDettaglioComponent', () => {
  let component: TimesheetDettaglioComponent;
  let fixture: ComponentFixture<TimesheetDettaglioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimesheetDettaglioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimesheetDettaglioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
