import { Injectable } from '@angular/core';
import { LocalStorageService } from './shared/constants/services/local-storage.service';
import { LOCAL_STORAGE, ROLES } from './shared/constants/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = false;
  private landlords: { email: string; password: string }[] = [];
  private users: { email: string; password: string }[] = [];
  private role: 'user' | 'landlord' | null = null;

  constructor(private localStorageService: LocalStorageService) {
    this.landlords = this.localStorageService.getItem('landlords') || [];
    this.users = this.localStorageService.getItem('users') || [];
  }

  register(email: string, password: string, role: 'user' | 'landlord'): boolean {
    if (role === ROLES.LANDLORD) {
      if (this.landlords.some((landlord) => landlord.email === email)) return false;
      this.landlords.push({ email, password });
      this.localStorageService.setItem('landlords', this.landlords);
    } else if (role === ROLES.USER) {
      if (this.users.some((user) => user.email === email)) return false;
      this.users.push({ email, password });
      this.localStorageService.setItem('users', this.users);
    }
    return true;
  }

  login(email: string, password: string, role: 'user' | 'landlord'): boolean {
    if (role === ROLES.LANDLORD) {
      const landlord = this.landlords.find((l) => l.email === email && l.password === password);
      if (landlord) {
        this.setLoginState(ROLES.LANDLORD, landlord.email);
        return true;
      }
    } else if (role === ROLES.USER) {
      const user = this.users.find((u) => u.email === email && u.password === password);
      if (user) {
        this.setLoginState(ROLES.USER, user.email);
        return true;
      }
    }
    return false;
  }

  private setLoginState(role: 'user' | 'landlord', email: string): void {
    this.isLoggedIn = true;
    this.localStorageService.setItem(LOCAL_STORAGE.IS_LOGGED_IN, 'true');
    this.localStorageService.setItem(LOCAL_STORAGE.ROLE, role);
    this.localStorageService.setItem(LOCAL_STORAGE.LOGIN_USER_EMAIL, email);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn || this.localStorageService.getItem(LOCAL_STORAGE.IS_LOGGED_IN) === 'true';
  }

  getRole(): 'user' | 'landlord' | null {
    return this.localStorageService.getItem(LOCAL_STORAGE.ROLE);
  }

  logout(): void {
    this.isLoggedIn = false;
    this.role = null;
    this.localStorageService.removeItem(LOCAL_STORAGE.IS_LOGGED_IN);
    this.localStorageService.removeItem(LOCAL_STORAGE.ROLE);
    this.localStorageService.removeItem(LOCAL_STORAGE.LOGIN_USER_EMAIL);
  }
}
