import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApartmentListComponent } from './apartment-list.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LOCAL_STORAGE, ROUTES } from '../../shared/constants/constants';
import { of } from 'rxjs';

describe('ApartmentListComponent', () => {
  let component: ApartmentListComponent;
  let fixture: ComponentFixture<ApartmentListComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['logout']);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule, ApartmentListComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApartmentListComponent);
    component = fixture.componentInstance;

    // Mock apartments data
    const apartments = [
      { id: 1, name: 'Apartment 1', location: 'City Center', price: 1000, comments: [] },
      { id: 2, name: 'Apartment 2', location: 'Suburbs', price: 500, comments: [] },
      { id: 3, name: 'Apartment 3', location: 'City Center', price: 1200, comments: [] },
    ];

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(apartments));
    spyOn(localStorage, 'setItem'); // To track calls to setItem

    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should load apartments from localStorage on initialization', () => {
    // Check if apartments are loaded correctly
    expect(component.apartments.length).toBe(3);
    expect(component.apartments[0].name).toBe('Apartment 1');
  });

  it('should filter apartments based on location and price', () => {
    // Set search form values
    component.searchForm.setValue({
      location: 'City Center',
      maxPrice: 1100,
    });

    // Trigger filtering logic
    fixture.detectChanges();

    // Check if filtered apartments match the criteria
    const filteredApartments = component.filteredApartments;
    expect(filteredApartments.length).toBe(1); // We expect only one apartment in the "City Center" with a price <= 1100
    expect(filteredApartments[0].name).toBe('Apartment 1'); // The only apartment that matches the criteria
  });

  it('should add a comment to an apartment', () => {
    const apartment = component.apartments[0]; // Get the first apartment
    const comment = 'Nice place!';

    // Add the comment
    component.addComment(apartment, comment);

    // Check if the comment was added correctly
    expect(apartment.comments.length).toBe(1);
    expect(apartment.comments[0].comment).toBe(comment);
    expect(localStorage.setItem).toHaveBeenCalledWith(LOCAL_STORAGE.SAVED_APARTMENTS, JSON.stringify(component.apartments)); // Check if localStorage is updated
  });

  it('should navigate to the login page on logout', () => {
    // Call logout
    component.logout();

    // Check if logout method of authService is called
    expect(mockAuthService.logout).toHaveBeenCalled();

    // Check if router navigate was called with the correct path
    expect(mockRouter.navigate).toHaveBeenCalledWith([ROUTES.LOGIN]);
  });
});
