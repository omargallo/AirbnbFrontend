import { Observable } from 'rxjs';
import { ConfirmService } from './../../core/services/confirm.service';
import { CommonModule } from '@angular/common';
import { Component, resource } from '@angular/core';
import { WishListModal } from "../../components/wish-list-modal/wish-list-modal";
import { PropertySwiperComponent } from "../../components/mainswiper/mainswiper";
import { Property } from '../../core/models/Property';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../core/services/Property/property.service';
import { Router } from '@angular/router';
import { WishlistService } from '../../core/services/Wishlist/wishlist.service';
import { AuthService } from '../../core/services/auth.service';
import { DialogService } from '../../core/services/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  imports: [CommonModule, WishListModal, PropertySwiperComponent, FormsModule],

  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  properties: Property[] = [];
  selectedPropertyId!: number;
  show = false;
  isLoading = false;

  constructor(
    private confirm: ConfirmService,
    private propertyService: PropertyService,
    private router: Router,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadProperties();
  }

  onPropertyClick(id: number) {
    this.router.navigate(['/property', id])
  }
  // onWishlistClick(id:number){

  //   this.selectedPropertyId = id;
  //   this.show = !this.show;
  // }

  onWishlistClick(id: number) {
    if (!this.authService.userId) {
      this.showToast('Please log in to add to wishlist.', 'top', 'right');
      this.dialogService.openDialog('login');
      return;
    }

    const property = this.properties.find(p => p.id === id);

    if (property?.isFavourite) {
      this.removeFromWishlist(id);
    } else {
      this.selectedPropertyId = id;
      this.show = !this.show;
    }
  }

  removeFromWishlist(propertyId: number) {
    this.wishlistService.removePropertyFromWishlist(propertyId).subscribe({
      next: (success) => {
        if (success) {
          const property = this.properties.find(p => p.id === propertyId);
          if (property) property.isFavourite = false;
          this.showToast('Property removed from wishlist', 'bottom', 'left');
        } else {
          this.showToast("Couldn't remove the property", 'bottom', 'left');
        }
      },
      error: () => {
        this.showToast("Couldn't remove the property", 'bottom', 'left');
      }
    });
  }

  onFinish(observable: Observable<boolean>) {
    this.onClose();
    observable.subscribe({
      next: (success) => {
        if (success) {
          const property = this.properties.find(p => p.id === this.selectedPropertyId);
          if (property) property.isFavourite = true;

          this.showToast('Property added to wishlist', 'bottom', 'left');
        } else {
          this.showToast("Couldn't add the property", 'bottom', 'left');
        }
      },
      error: () => {
        this.showToast("Couldn't add the property", 'bottom', 'left');
      }
    });
  }

  private showToast(message: string, vertical: 'top' | 'bottom', horizontal: 'left' | 'right') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: horizontal,
      verticalPosition: vertical,
      panelClass: ['custom-snackbar']
    });
  }


  loadProperties() {
    this.isLoading = true;
    this.propertyService.searchProperties({}).subscribe({
      next: (response) => {
        console.log('🔍 Search Response:', response);

        if (response.isSuccess) {
          this.properties = response.data.items;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ API Error:', err);
        this.isLoading = false;
      },
    });
  }

  onClose() {

    this.show = false
  }




}
