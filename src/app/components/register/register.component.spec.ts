import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component'; // Import RegisterComponent here
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { ROUTES, ALERTS, SUCCESS_MESSAGES } from '../../shared/constants/constants';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['register']);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule, RegisterComponent],  // Import the standalone component here
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should register successfully and navigate to login page', () => {
    const mockFormData = {
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    };
    component.registerForm.setValue(mockFormData);

    mockAuthService.register.and.returnValue(true);

    component.onRegister();

    expect(component.successMessage).toBe(SUCCESS_MESSAGES.REGISTERATION_COMPLETED);
    expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTES.LOGIN]);
  });

  it('should show error message if email already exists', () => {
    const mockFormData = {
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    };
    component.registerForm.setValue(mockFormData);

    mockAuthService.register.and.returnValue(false);

    component.onRegister();

    expect(component.errorMessage).toBe(ALERTS.EMAIL_ALREADY_EXIST);
    expect(component.successMessage).toBe('');
  });

  it('should show error message if form is invalid', () => {
    component.registerForm.setValue({
      email: '',
      password: '',
      role: '',
    });

    component.onRegister();

    expect(component.errorMessage).toBe('Please fill out all fields correctly.');
    expect(component.successMessage).toBe('');
  });
});
