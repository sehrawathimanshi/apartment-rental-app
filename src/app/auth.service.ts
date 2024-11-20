import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = false; // Tracks if a user or landlord is logged in
  private landlords: { email: string; password: string }[] = []; // Array to store landlord credentials
  private users: { email: string; password: string }[] = []; // Array to store user credentials
  private role: 'user' | 'landlord' | null = null; // Tracks logged-in role

  constructor() {
    // Load landlords and users from localStorage
    const savedLandlords = localStorage.getItem('landlords');
    if (savedLandlords) {
      this.landlords = JSON.parse(savedLandlords);
    }

    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    }
  }

  // Register a new landlord or user
  register(email: string, password: string, role: 'user' | 'landlord'): boolean {
    if (role === 'landlord') {
      if (this.landlords.some((landlord) => landlord.email === email)) {
        return false; // Email already exists for landlords
      }
      this.landlords.push({ email, password });
      localStorage.setItem('landlords', JSON.stringify(this.landlords));
    } else if (role === 'user') {
      if (this.users.some((user) => user.email === email)) {
        return false; // Email already exists for users
      }
      this.users.push({ email, password });
      localStorage.setItem('users', JSON.stringify(this.users));
    }
    return true;
  }

  login(email: string, password: string, role: 'user' | 'landlord'): boolean {
    if (role === 'landlord') {
      const landlord = this.landlords.find(
        (l) => l.email === email && l.password === password
      );
      if (landlord) {
        this.isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', 'landlord'); // Store the role
        return true;
      }
    } else if (role === 'user') {
      const user = this.users.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        this.isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', 'user'); // Store the role
        localStorage.setItem('loggedInUserEmail', user.email); // Store the role

        return true;
      }
    }
    return false;
  }
  
  isAuthenticated(): boolean {
    return this.isLoggedIn || localStorage.getItem('isLoggedIn') === 'true';
  }
  
  getRole(): 'user' | 'landlord' | null {
    return localStorage.getItem('role') as 'user' | 'landlord' | null;
  }
  
  // Log out the user or landlord
  logout(): void {
    this.isLoggedIn = false;
    this.role = null;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
  }
}
