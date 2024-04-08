import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpiegatoFormComponentComponent } from './impiegato-form-component.component';

describe('ImpiegatoFormComponentComponent', () => {
  let component: ImpiegatoFormComponentComponent;
  let fixture: ComponentFixture<ImpiegatoFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpiegatoFormComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImpiegatoFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
