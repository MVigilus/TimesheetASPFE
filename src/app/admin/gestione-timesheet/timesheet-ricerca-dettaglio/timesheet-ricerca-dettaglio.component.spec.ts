import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetRicercaDettaglioComponent } from './timesheet-ricerca-dettaglio.component';

describe('TimesheetRicercaDettaglioComponent', () => {
  let component: TimesheetRicercaDettaglioComponent;
  let fixture: ComponentFixture<TimesheetRicercaDettaglioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimesheetRicercaDettaglioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimesheetRicercaDettaglioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
