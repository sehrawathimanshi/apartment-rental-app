import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  role:'user' | 'landlord' | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    if (!this.role) {
      this.errorMessage = 'Please select a role: User or Landlord.';
      this.successMessage = '';
      return;
    }

    const isRegistered = this.authService.register(this.email, this.password, this.role);

    if (isRegistered) {
      this.successMessage = 'Registration successful! Please log in.';
      this.errorMessage = '';
      this.router.navigate(['/login']); // Redirect to the login page
    } else {
      this.errorMessage = 'Email is already registered.';
      this.successMessage = '';
    }
  }
}
