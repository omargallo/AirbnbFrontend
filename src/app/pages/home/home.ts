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
    private wishlistService: WishlistService
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
    const property = this.properties.find(p => p.id === id);

    if (property?.isFavourite) {
      // Remove from wishlist
      this.removeFromWishlist(id);
    } else {
      // Add to wishlist (existing logic)
      this.selectedPropertyId = id;
      this.show = !this.show;
    }
  }
  removeFromWishlist(propertyId: number) {
    this.wishlistService.removePropertyFromWishlist(propertyId).subscribe({
      next: (success) => {
        if (success) {
          // Update the property's favorite status
          const property = this.properties.find(p => p.id === propertyId);
          if (property) {
            property.isFavourite = false;
          }
          this.confirm.success("Success", "Property removed from wishlist");
        } else {
          this.confirm.fail("Failed", "Couldn't remove the property");
        }
      },
      error: () => {
        this.confirm.fail("Failed", "Couldn't remove the property");
      }
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
  onFinish(observable: Observable<boolean>) {
    this.onClose();
    observable.subscribe({
      next: (success) => {
        if (success) {
          // ✅ Update favorite status
          const property = this.properties.find(p => p.id === this.selectedPropertyId);
          if (property) {
            property.isFavourite = true;
          }

          this.confirm.success("Success", "Property added to wish list");
        } else {
          this.confirm.fail("Faild", "Couldn't add the property");
        }
      },
      error: () => {
        this.confirm.fail("Faild", "Couldn't add the property");
      }
    });
  }



}
