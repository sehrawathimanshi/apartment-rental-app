import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['login', 'getRole']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent], // Include standalone component
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message if email, password, or role is invalid', () => {
    authServiceSpy.login.and.returnValue(false);

    component.email = 'test@example.com';
    component.password = 'wrong-password';
    component.role = 'user';
    component.onLogin();

    expect(component.errorMessage).toBe('Invalid email, password, or role!');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to the post apartment page for landlord role on successful login', () => {
    authServiceSpy.login.and.returnValue(true);
    authServiceSpy.getRole.and.returnValue('landlord');

    component.email = 'landlord@example.com';
    component.password = 'password';
    component.role = 'landlord';
    component.onLogin();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/post-apartment']);
    expect(component.errorMessage).toBe('');
  });

  it('should navigate to the apartments page for user role on successful login', () => {
    authServiceSpy.login.and.returnValue(true);
    authServiceSpy.getRole.and.returnValue('user');

    component.email = 'user@example.com';
    component.password = 'password';
    component.role = 'user';
    component.onLogin();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/apartments']);
    expect(component.errorMessage).toBe('');
  });

  it('should navigate to the registration page when goToRegister is called', () => {
    component.goToRegister();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/register']);
  });
});
