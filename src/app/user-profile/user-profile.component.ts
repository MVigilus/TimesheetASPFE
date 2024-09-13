import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {AuthService} from "@core";
import {
  AbstractControl,
  Form,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn, Validators
} from "@angular/forms";
import {MatCheckbox} from "@angular/material/checkbox";
import Swal from "sweetalert2";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTabGroup,
    MatTab,
    MatIcon,
    MatTabLabel,
    MatLabel,
    MatFormField,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    MatCheckbox
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  changePasswordFormGroup:FormGroup;

  notSamePassword = (formGroup: FormGroup): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {

      // Check if the control's value exists and is a number
      if (control.value && control.value !== '') {
        // Returns an error if the condition is true
        if (control.value !== formGroup.get('newPassword1')?.value) {
          return { 'NotSamePassword': true };
        }
      }

      // If the control's value is valid, return null
      return null;
    };
  };

  constructor(private authService:AuthService,
              private fb:FormBuilder,) {
    super();
    this.changePasswordFormGroup=this.fb.group({
      newPassword1:['',[Validators.required]],
      newPassword2: ['']
    });

    // Then, set the validator for newPassword2 after the form group is created
    this.changePasswordFormGroup.get('newPassword2')?.setValidators(this.notSamePassword(this.changePasswordFormGroup));

    // You may need to trigger validation manually after setting validators
    this.changePasswordFormGroup.get('newPassword2')?.updateValueAndValidity();

  }

  get currentUserValue(){
    return this.authService.currentUserValue
  }

  get currentUserRoleTrimmedValue(){
    return this.authService.currentUserValue.role.split('_')[1]
  }

  SalvaPassword(){
    this.subs.add(this.authService.setPassword(this.changePasswordFormGroup.get('newPassword2')?.value).subscribe({
      next: (value) => {
        Swal.fire({
          icon: 'success',
          title: 'Operazione Completata',
          text: 'Password cambiata',
        })
      }
    }))
  }

  ngOnInit(): void {
  }

}
