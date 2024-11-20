import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { ApartmentComponent } from './apartment.component';

describe('ApartmentComponent', () => {
  let component: ApartmentComponent;
  let fixture: ComponentFixture<ApartmentComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['logout']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ApartmentComponent], // Include standalone component
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApartmentComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with apartments from localStorage', () => {
    const mockApartments = [{ id: '1', name: 'Test Apartment', location: 'Test City', price: 1000, comments: [] }];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockApartments));

    component.ngOnInit();

    expect(component.apartments).toEqual(mockApartments);
  });

  it('should create a new apartment and save to localStorage', () => {
    const mockSetItem = spyOn(localStorage, 'setItem');
    component.apartment = { id: '', name: 'Apartment 1', location: 'City A', price: 2000, comments: [] };

    component.createApartment();

    expect(component.apartments.length).toBe(1);
    expect(component.apartments[0].name).toBe('Apartment 1');
    expect(mockSetItem).toHaveBeenCalledWith('apartments', jasmine.any(String));
  });

  it('should show an alert if required fields are missing when creating an apartment', () => {
    spyOn(window, 'alert');
    component.apartment = { id: '', name: '', location: '', price: null, comments: [] };

    component.createApartment();

    expect(window.alert).toHaveBeenCalledWith('Please fill out all fields!');
    expect(component.apartments.length).toBe(0);
  });

  it('should add a comment to an apartment and save to localStorage', () => {
    const mockSetItem = spyOn(localStorage, 'setItem');
    const apartment = { id: '1', name: 'Apartment 1', location: 'City A', price: 2000, comments: [] };
    component.apartments = [apartment];
    spyOn(localStorage, 'getItem').and.returnValue('testUser@example.com');

    component.addComment(apartment, 'Nice place!');

    expect(apartment.comments.length).toBe(1);
    expect(apartment.comments[0]['comment']).toBe('Nice place!');
    expect(apartment.comments[0]['senderName']).toBe('testUser@example.com');
    expect(mockSetItem).toHaveBeenCalledWith('apartments', jasmine.any(String));
  });

  it('should not add a comment if the comment is empty', () => {
    const apartment = { id: '1', name: 'Apartment 1', location: 'City A', price: 2000, comments: [] };
    component.apartments = [apartment];
    spyOn(localStorage, 'setItem');

    component.addComment(apartment, '');

    expect(apartment.comments.length).toBe(0);
  });

  it('should logout and navigate to login page', () => {
    component.logout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should generate a unique ID', () => {
    const id1 = component.generateUniqueId('testKey');
    const id2 = component.generateUniqueId('testKey');

    expect(id1).not.toBe(id2);
    expect(id1).toContain('testKey');
  });
});
