import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['register']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent], // Include standalone component
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error if no role is selected', () => {
    component.email = 'test@example.com';
    component.password = 'password';
    component.role = null;

    component.onRegister();

    expect(component.errorMessage).toBe('Please select a role: User or Landlord.');
    expect(component.successMessage).toBe('');
    expect(authServiceSpy.register).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should show a success message and navigate to login on successful registration', () => {
    authServiceSpy.register.and.returnValue(true);
    component.email = 'test@example.com';
    component.password = 'password';
    component.role = 'user';

    component.onRegister();

    expect(component.successMessage).toBe('Registration successful! Please log in.');
    expect(component.errorMessage).toBe('');
    expect(authServiceSpy.register).toHaveBeenCalledWith('test@example.com', 'password', 'user');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show an error if the email is already registered', () => {
    authServiceSpy.register.and.returnValue(false);
    component.email = 'test@example.com';
    component.password = 'password';
    component.role = 'landlord';

    component.onRegister();

    expect(component.errorMessage).toBe('Email is already registered.');
    expect(component.successMessage).toBe('');
    expect(authServiceSpy.register).toHaveBeenCalledWith('test@example.com', 'password', 'landlord');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
