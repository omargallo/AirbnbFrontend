import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { WishlistService } from '../../core/services/Wishlist/wishlist.service';
import { Property } from '../../core/models/Property';
import { environment } from '../../../environments/environment.development';
import { SliderCard } from "../home/components/slider-card/slider-card";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wish-list-properties',
  templateUrl: './wishlist-properties.html',
  styleUrls: ['./wishlist-properties.css'],
  standalone: true,
  imports: [RouterModule, SliderCard, CommonModule]
})
export class WishListProperties implements OnInit {
  properties: Property[] = [];
  wishlistId!: number;
  wishlistName: string = '';
  goBack() {
    window.history.back();
  }

  constructor(
    private route: ActivatedRoute,
    private wishlistService: WishlistService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('wishlistId');
      if (id) {
        this.wishlistId = +id;
        this.fetchProperties();
      }
    });
  }

  trackByPropertyId(index: number, item: Property): number {
    return item.id;
  }

  isLoading: boolean = true;

  fetchProperties(): void {
    this.isLoading = true;
    this.wishlistService.getPropertiesInWishlist(this.wishlistId).subscribe(data => {
      this.properties = data.properties;
      this.wishlistName = data.name;
      this.isLoading = false;
      console.log('Wishlist:', this.wishlistName, 'Properties:', this.properties);
    }, err => {
      this.isLoading = false;
      console.error('Error loading wishlist properties', err);
    });
  }



  getPropertyImage(property: Property): string {
    const cover = property.images?.find(img => img.isCover && !img.isDeleted);

    if (cover?.imageUrl) {
      return `${environment.base}${cover.imageUrl}`;
    }

    return 'assets/images/deafult.png';
  }

}
