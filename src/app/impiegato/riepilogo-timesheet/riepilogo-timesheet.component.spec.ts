import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiepilogoTimesheetComponent } from './riepilogo-timesheet.component';

describe('RiepilogoTimesheetComponent', () => {
  let component: RiepilogoTimesheetComponent;
  let fixture: ComponentFixture<RiepilogoTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiepilogoTimesheetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RiepilogoTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
