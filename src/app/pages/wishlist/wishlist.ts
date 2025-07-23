import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/Wishlist/wishlist.service';
import { Wishlist } from './../../core/models/Wishlist';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { Modal } from "../../shared/components/modal/modal";

@Component({
  selector: 'app-wishlists',
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css'],
  imports: [CommonModule, Modal]
})
export class Wishlists implements OnInit {
  wishlists: Wishlist[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private wishlistService: WishlistService) { }

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
        console.log(data)
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



  selectedWishlist: Wishlist | null = null;
  showModal = false;

  confirmDelete(wishlist: Wishlist, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedWishlist = wishlist;
    this.showModal = true;
  }

  cancelDelete(): void {
    this.showModal = false;
    this.selectedWishlist = null;
  }

  deleteSelectedWishlist(): void {
    if (!this.selectedWishlist) return;

    this.wishlistService.deleteWishlist(this.selectedWishlist.id).subscribe({
      next: (success) => {
        if (success) {
          this.wishlists = this.wishlists.filter(w => w.id !== this.selectedWishlist!.id);
        }
        this.cancelDelete();
      },
      error: (err) => {
        console.error('Failed to delete wishlist:', err);
        this.cancelDelete();
      }
    });
  }

}