import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneFileComponent } from './gestione-file.component';

describe('GestioneFileComponent', () => {
  let component: GestioneFileComponent;
  let fixture: ComponentFixture<GestioneFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestioneFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestioneFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
