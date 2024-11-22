import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ALERTS, ROUTES } from '../../shared/constants/constants';

// Mock AuthService and Router
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['login', 'getRole']);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent], // Add LoginComponent to imports
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the registration page when goToRegister is called', () => {
    component.goToRegister();
    expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTES.REGISTER]);
  });

  it('should display an error message when the form is invalid and login is attempted', () => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    component.loginForm.controls['role'].setValue('');

    component.onLogin();

    expect(component.errorMessage).toBe('Please fill in all fields correctly.');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should call AuthService login and navigate to the correct route on successful login for landlord', () => {
    const email = 'landlord@example.com';
    const password = 'password123';
    const role = 'landlord';

    component.loginForm.controls['email'].setValue(email);
    component.loginForm.controls['password'].setValue(password);
    component.loginForm.controls['role'].setValue(role);

    mockAuthService.login.and.returnValue(true);
    mockAuthService.getRole.and.returnValue(role);

    component.onLogin();

    expect(mockAuthService.login).toHaveBeenCalledWith(email, password, role);
    expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTES.POST_APARTMENT]);
    expect(component.errorMessage).toBe('');
  });

  it('should call AuthService login and navigate to the correct route on successful login for user', () => {
    const email = 'user@example.com';
    const password = 'password123';
    const role = 'user';

    component.loginForm.controls['email'].setValue(email);
    component.loginForm.controls['password'].setValue(password);
    component.loginForm.controls['role'].setValue(role);

    mockAuthService.login.and.returnValue(true);
    mockAuthService.getRole.and.returnValue(role);

    component.onLogin();

    expect(mockAuthService.login).toHaveBeenCalledWith(email, password, role);
    expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTES.APARTMENT_LIST]);
    expect(component.errorMessage).toBe('');
  });

  it('should display an error message if login fails', () => {
    const email = 'wrong@example.com';
    const password = 'wrongpassword';
    const role = 'user';

    component.loginForm.controls['email'].setValue(email);
    component.loginForm.controls['password'].setValue(password);
    component.loginForm.controls['role'].setValue(role);

    mockAuthService.login.and.returnValue(false);

    component.onLogin();

    expect(component.errorMessage).toBe(ALERTS.INVALID);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
