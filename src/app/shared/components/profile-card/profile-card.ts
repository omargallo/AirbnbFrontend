import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-card',
  imports: [],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.css'
})
export class ProfileCard {
  @Input() firstName?: string;
  @Input() lastName?: string;
  @Input() country?: string;
  @Input() profileImageUrl?: string;
  @Input() userId?: string;
  @Input() userType: 'Host' | 'Guest' = 'Host';
  @Input() stats?: any;
  @Input() showHeartBadge: boolean = false;
  @Input() imageBaseUrl: string = '';
  @Input() imageErrors: Set<string | undefined> = new Set();
  @Input() onImageErrorCallback?: (event: any, item: any) => void;

  get statsArray() {
    if (!this.stats) return [];
    
    if (this.userType === 'Host') {
      return [
        { label: 'Reviews', value: this.stats.totalReviews },
        { label: 'Rating', value: this.stats.averageRating?.toFixed(1), icon: 'fas fa-star text-warning' },
        { label: 'Months hosting', value: this.stats.monthsHosting }
      ];
    } else {
      return [
        { label: 'Trips', value: this.stats.totalTrips },
        { label: 'Reviews', value: this.stats.totalReviews },
        { label: 'Years on Platform', value: this.stats.yearsOnPlatform }
      ];
    }
  }

  getImageUrl(profilePictureURL: string | undefined): string {
    if (!profilePictureURL) {
      return '';
    }
    return this.imageBaseUrl + profilePictureURL;
  }

  onImageError(event: any): void {
    if (this.onImageErrorCallback) {
      this.onImageErrorCallback(event, { id: this.userId });
    }
    this.imageErrors.add(this.userId);
  }

  shouldShowImage(imageUrl: string | undefined, itemId: string | undefined): boolean {
    return !!(imageUrl && imageUrl.trim() !== '' && !this.imageErrors.has(itemId));
  }

  shouldShowFallback(imageUrl: string | undefined, itemId: string | undefined): boolean {
    return !imageUrl || imageUrl.trim() === '' || this.imageErrors.has(itemId);
  }

  getInitials(firstName: string, lastName: string): string {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
  }
}
