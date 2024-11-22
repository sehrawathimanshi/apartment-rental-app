import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ALERTS, ROUTES, SUCCESS_MESSAGES } from '../../shared/constants/constants';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
    });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const { email, password, role } = this.registerForm.value;

      const isRegistered = this.authService.register(email, password, role);
      if (isRegistered) {
        this.successMessage = SUCCESS_MESSAGES.REGISTERATION_COMPLETED;
        this.errorMessage = '';
        this.router.navigate([ROUTES.LOGIN]);
      } else {
        this.errorMessage = ALERTS.EMAIL_ALREADY_EXIST;
        this.successMessage = '';
      }
    } else {
      this.errorMessage = 'Please fill out all fields correctly.';
      this.successMessage = '';
    }
  }
}
