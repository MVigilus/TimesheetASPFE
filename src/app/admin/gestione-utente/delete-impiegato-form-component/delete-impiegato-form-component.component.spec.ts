import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteImpiegatoFormComponentComponent } from './delete-impiegato-form-component.component';

describe('DeleteImpiegatoFormComponentComponent', () => {
  let component: DeleteImpiegatoFormComponentComponent;
  let fixture: ComponentFixture<DeleteImpiegatoFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteImpiegatoFormComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteImpiegatoFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
