import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { ApartmentListComponent } from './apartment-list.component';

describe('ApartmentListComponent', () => {
  let component: ApartmentListComponent;
  let fixture: ComponentFixture<ApartmentListComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['logout']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ApartmentListComponent], // Include standalone component
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApartmentListComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize apartments from localStorage', () => {
    const mockApartments = [
      { id: '1', name: 'Apartment 1', location: 'City A', price: 1000, comments: [] },
    ];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockApartments));

    component.ngOnInit();

    expect(component.apartments).toEqual(mockApartments);
  });

  it('should filter apartments by location', () => {
    component.apartments = [
      { id: '1', name: 'Apartment 1', location: 'City A', price: 1000, comments: [] },
      { id: '2', name: 'Apartment 2', location: 'City B', price: 1500, comments: [] },
    ];
    component.searchLocation = 'City A';

    const filtered = component.filteredApartments;

    expect(filtered.length).toBe(1);
    expect(filtered[0].location).toBe('City A');
  });

  it('should filter apartments by price', () => {
    component.apartments = [
      { id: '1', name: 'Apartment 1', location: 'City A', price: 1000, comments: [] },
      { id: '2', name: 'Apartment 2', location: 'City B', price: 1500, comments: [] },
    ];
    component.searchPrice = 1200;

    const filtered = component.filteredApartments;

    expect(filtered.length).toBe(1);
    expect(filtered[0].price).toBe(1000);
  });

  it('should filter apartments by location and price', () => {
    component.apartments = [
      { id: '1', name: 'Apartment 1', location: 'City A', price: 1000, comments: [] },
      { id: '2', name: 'Apartment 2', location: 'City B', price: 1500, comments: [] },
    ];
    component.searchLocation = 'City A';
    component.searchPrice = 1200;

    const filtered = component.filteredApartments;

    expect(filtered.length).toBe(1);
    expect(filtered[0].location).toBe('City A');
    expect(filtered[0].price).toBe(1000);
  });

  it('should add a comment to an apartment', () => {
    const mockSetItem = spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.returnValue('testUser@example.com');

    const apartment = { id: '1', name: 'Apartment 1', location: 'City A', price: 1000, comments: [] };
    component.apartments = [apartment];

    component.addComment(apartment, 'Nice place!');

    expect(apartment.comments.length).toBe(1);
    expect(apartment.comments[0]['comment']).toBe('Nice place!');
    expect(apartment.comments[0]['senderName']).toBe('testUser@example.com');
    expect(mockSetItem).toHaveBeenCalledWith('apartments', jasmine.any(String));
  });

  it('should not add a comment if the comment is empty', () => {
    const mockSetItem = spyOn(localStorage, 'setItem');
    const apartment = { id: '1', name: 'Apartment 1', location: 'City A', price: 1000, comments: [] };
    component.apartments = [apartment];

    component.addComment(apartment, '');

    expect(apartment.comments.length).toBe(0);
    expect(mockSetItem).not.toHaveBeenCalled();
  });

  it('should logout and navigate to login page', () => {
    component.logout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
