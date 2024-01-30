import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneTimesheetComponent } from './gestione-timesheet.component';

describe('GestioneTimesheetComponent', () => {
  let component: GestioneTimesheetComponent;
  let fixture: ComponentFixture<GestioneTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestioneTimesheetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestioneTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
