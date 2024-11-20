import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apartment-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.scss']
})
export class ApartmentListComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  apartments: any[] = [];  // Array to hold apartments
  searchLocation: string = ''; // Search term for location
  searchPrice: number | null = null; // Search term for price

  // Load apartments from localStorage
  ngOnInit(): void {
    const savedApartments = localStorage.getItem('apartments');
    if (savedApartments) {
      this.apartments = JSON.parse(savedApartments);
    }
  }

  // Filter apartments based on search location and price
  get filteredApartments() {
    return this.apartments.filter((apt) => {
      const matchesLocation = this.searchLocation
        ? apt.location.toLowerCase().includes(this.searchLocation.toLowerCase())
        : true;
      const matchesPrice = this.searchPrice ? apt.price <= this.searchPrice : true;

      return matchesLocation && matchesPrice;
    });
  }

  
  addComment(apartment: any, comment: string) {
    if (comment) {
      apartment.comments.push({senderId:apartment.id, senderName: localStorage.getItem('loggedInUserEmail'), comment: comment});
      localStorage.setItem('apartments', JSON.stringify(this.apartments)); // Save to localStorage
    }
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Navigate to post apartment page

  }
}
