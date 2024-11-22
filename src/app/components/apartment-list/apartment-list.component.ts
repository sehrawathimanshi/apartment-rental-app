import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { LOCAL_STORAGE, ROUTES } from '../../shared/constants/constants';

@Component({
  selector: 'app-apartment-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.scss']
})
export class ApartmentListComponent implements OnInit {
  apartments: any[] = []; // Array to hold apartments
  searchForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      location: [''],
      maxPrice: ['']
    });
  }

  // Load apartments from localStorage
  ngOnInit(): void {
    const savedApartments = localStorage.getItem(LOCAL_STORAGE.SAVED_APARTMENTS);
    if (savedApartments) {
      this.apartments = JSON.parse(savedApartments);
    }
  }

  // Filter apartments based on search location and price
  get filteredApartments() {
    const { location, maxPrice } = this.searchForm.value;

    return this.apartments.filter((apt) => {
      const matchesLocation = location
        ? apt.location.toLowerCase().includes(location.toLowerCase())
        : true;
      const matchesPrice = maxPrice ? apt.price <= +maxPrice : true;

      return matchesLocation && matchesPrice;
    });
  }

  addComment(apartment: any, comment: string) {
    if (comment) {
      apartment.comments.push({
        senderId: apartment.id,
        senderName: localStorage.getItem(LOCAL_STORAGE.LOGIN_USER_EMAIL),
        comment: comment
      });
      localStorage.setItem(LOCAL_STORAGE.SAVED_APARTMENTS, JSON.stringify(this.apartments)); // Save to localStorage
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate([ROUTES.LOGIN]); // Navigate to login page
  }
}
