
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  role: 'user' | 'landlord' | null = null; // Added role property
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (this.role && this.authService.login(this.email, this.password, this.role)) {
      const role = this.authService.getRole();

      if (role === 'landlord') {
        this.router.navigate(['/post-apartment']); // Navigate to post apartment page
      } else if (role === 'user') {
        this.router.navigate(['/apartments']); // Navigate to post apartment page
      }      
    } else {
      this.errorMessage = 'Invalid email, password, or role!';
    }
  }

  goToRegister() {
    this.router.navigate(['/register']); // Redirect to the registration page
  }
}


