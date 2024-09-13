import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RicercaTimesheetComponent } from './ricerca-timesheet.component';

describe('RicercaTimesheetComponent', () => {
  let component: RicercaTimesheetComponent;
  let fixture: ComponentFixture<RicercaTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RicercaTimesheetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RicercaTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
