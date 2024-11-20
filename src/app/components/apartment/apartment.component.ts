import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-apartment',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.scss']
})
export class ApartmentComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}

  apartment: any = {
    id: '',
    name: '',
    location: '',
    price: null,
    comments: [] // Array to store comments
  };

  apartments: any[] = []; // Array to hold created apartments

  // Load apartments from local storage when the component initializes
  ngOnInit(): void {
    const savedApartments = localStorage.getItem('apartments');
    if (savedApartments) {
      this.apartments = JSON.parse(savedApartments);
    }
  }

  // Function to add a new apartment
  createApartment() {
    if (this.apartment.name && this.apartment.location && this.apartment.price) {
      this.apartments.push({  ...this.apartment,  id: this.generateUniqueId('tolet') });

      // Save the updated apartments list to localStorage
      localStorage.setItem('apartments', JSON.stringify(this.apartments));

      // Reset the form
      this.apartment = { name: '', location: '', price: null, comments: [] };
    } else {
      alert('Please fill out all fields!');
    }
  }

  // Function to add a comment to an apartment
  addComment(apartment: any, comment: string) {
    if (comment) {
      apartment.comments.push({senderId:apartment.id, senderName: localStorage.getItem('loggedInUserEmail'), comment: comment});
      localStorage.setItem('apartments', JSON.stringify(this.apartments)); // Save to localStorage
    }
  }
  generateUniqueId(key: string) {
    return `${key}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Navigate to post apartment page

  }
}
