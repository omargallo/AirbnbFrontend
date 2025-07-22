import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/Wishlist/wishlist.service';
import { Wishlist } from './../../core/models/Wishlist';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-wishlists',
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css'],
  imports:[CommonModule]
})
export class Wishlists implements OnInit {
  wishlists: Wishlist[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.loadWishlists();
  }

  loadWishlists(): void {
    this.isLoading = true;
    this.error = null;
    
    this.wishlistService.getAllWishlists().subscribe({
      next: (data) => {
        this.wishlists = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading wishlists:', error);
        this.error = 'Failed to load wishlists. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getPropertyCount(propertyIds: number[]): number {
    return propertyIds ? propertyIds.length : 0;
  }

  getPropertyImage(imgUrl: string): string {
    return `${environment.base}${imgUrl}`;
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  onWishlistClick(wishlist: Wishlist): void {
    console.log('Clicked wishlist:', wishlist.name);
    // Navigate to wishlist details page
    // this.router.navigate(['/wishlist', wishlist.id]);
  }


}