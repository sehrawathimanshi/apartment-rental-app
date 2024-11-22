import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ALERTS, ROUTES } from '../../shared/constants/constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password, role } = this.loginForm.value;
      if (this.authService.login(email, password, role)) {
        const role = this.authService.getRole();

        if (role === 'landlord') {
          this.router.navigate([ROUTES.POST_APARTMENT]); // Navigate to post apartment page
        } else if (role === 'user') {
          this.router.navigate([ROUTES.APARTMENT_LIST]); // Navigate to post apartment page
        }
      } else {
        this.errorMessage = ALERTS.INVALID;
      }
    } else {
      this.errorMessage = 'Please fill in all fields correctly.';
    }
  }

  goToRegister() {
    this.router.navigate([ROUTES.REGISTER]); // Redirect to the registration page
  }
}
