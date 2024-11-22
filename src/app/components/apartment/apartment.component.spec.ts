import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApartmentComponent } from './apartment.component'; // Import ApartmentComponent here
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { LOCAL_STORAGE, ALERTS, ROUTES } from '../../shared/constants/constants';

describe('ApartmentComponent', () => {
  let component: ApartmentComponent;
  let fixture: ComponentFixture<ApartmentComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['logout']);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule, ApartmentComponent],  // Import the standalone component here
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create an apartment when form is valid', () => {
    const formData = {
      name: 'Apartment 1',
      location: 'City Center',
      price: 1000,
    };

    component.apartmentForm.setValue(formData);

    // Mock the localStorage.setItem method
    const localStorageSetItemSpy = spyOn(localStorage, 'setItem');

    component.createApartment();

    expect(component.apartments.length).toBe(1);  // Check if the apartment is added
    expect(localStorageSetItemSpy).toHaveBeenCalledWith(
      LOCAL_STORAGE.SAVED_APARTMENTS,
      JSON.stringify(component.apartments)
    );
    expect(component.apartmentForm.value).toEqual({
      name: null,
      location: null,
      price: null,
    });  // Check if the form is reset after creation
  });

  it('should show an alert if form is invalid', () => {
    spyOn(window, 'alert'); // Spy on alert function

    // Set an invalid form (missing name and location)
    component.apartmentForm.setValue({
      name: '',
      location: '',
      price: 1000,
    });

    component.createApartment();

    expect(window.alert).toHaveBeenCalledWith(ALERTS.ALL_FIELDS);  // Check if alert is shown
  });

  it('should logout and navigate to login', () => {
    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTES.LOGIN]);
  });
});
