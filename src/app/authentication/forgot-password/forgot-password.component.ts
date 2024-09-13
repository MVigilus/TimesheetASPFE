import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {AuthService} from "@core";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import Swal from "sweetalert2";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatProgressSpinner,
  ],
})
export class ForgotPasswordComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  returnUrl!: string;
  loading=false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required, /*Validators.minLength(5)*/],
      ],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
      this.loading=true;
      this.subs.sink=this.authService.resetPassword(this.f["email"].value).subscribe({
        next:res=>{
          if(res){
            Swal.fire('Password Resettata', 'riceverai la nuova password per email', 'success');
          }else {
            Swal.fire({
              icon: 'error',
              title: 'Email non trovata',
              text: 'Assicurati di aver inserito l\'email giusta!',
              footer: '' +
                '',
            });
          }
          this.loading=false;
          //this.router.navigate(['/authentication/signin']);
        },
        error: res => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Qualcosa è andato Storto!',
            footer: '' +
              '',
          });
          this.loading=false;

          this.router.navigate(['/authentication/signin']);
        }
      })
    }
  }
}
