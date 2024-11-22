import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { ALERTS, LOCAL_STORAGE, ROUTES } from '../../shared/constants/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-apartment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],

  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.scss'],
})
export class ApartmentComponent implements OnInit {
  apartmentForm: FormGroup;
  apartments: any[] = []; // Array to hold created apartments

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.apartmentForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    const savedApartments = localStorage.getItem(LOCAL_STORAGE.SAVED_APARTMENTS);
    if (savedApartments) {
      this.apartments = JSON.parse(savedApartments);
    }
  }

  createApartment(): void {
    if (this.apartmentForm.valid) {
      const newApartment = {
        ...this.apartmentForm.value,
        id: this.generateUniqueId('tolet'),
        comments: [],
      };
      this.apartments.push(newApartment);

      // Save to localStorage
      localStorage.setItem(LOCAL_STORAGE.SAVED_APARTMENTS, JSON.stringify(this.apartments));

      // Reset the form
      this.apartmentForm.reset();
    } else {
      alert(ALERTS.ALL_FIELDS);
    }
  }

  addComment(apartment: any, comment: string): void {
    if (comment) {
      apartment.comments.push({
        senderId: apartment.id,
        senderName: localStorage.getItem(LOCAL_STORAGE.LOGIN_USER_EMAIL),
        comment,
      });
      localStorage.setItem(LOCAL_STORAGE.SAVED_APARTMENTS, JSON.stringify(this.apartments)); // Save to localStorage
    }
  }

  generateUniqueId(key: string): string {
    return `${key}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate([ROUTES.LOGIN]); // Navigate to login page
  }
}
