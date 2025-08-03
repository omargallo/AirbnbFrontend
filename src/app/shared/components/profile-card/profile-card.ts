interface StatItem {
  label: string;
  value: any;
  icon?: string;
}

import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-card',
  imports: [CommonModule],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.css',
})
export class ProfileCard {
  @Input() firstName?: string;
  @Input() lastName?: string;
  @Input() country?: string;
  @Input() profileImageUrl?: string;
  @Input() userId?: string;
  @Input() userType: 'Host' | 'Guest' = 'Host';
  @Input() stats?: any;
  @Input() showHeartBadge: boolean | null = false;
  @Input() imageBaseUrl: string = '';
  @Input() imageErrors: Set<string | undefined> = new Set();
  @Input() onImageErrorCallback?: (event: any, item: any) => void;
  @Input() clickable: boolean = true;

  navigateToProfile(): void {
    if (this.clickable && this.userId) {
      this.router.navigate(['/user', this.userId]);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigateToProfile();
    }
  }
  constructor(private router: Router) {}

  get statsArray(): StatItem[] {
    if (!this.stats) return [];

    if (this.userType === 'Host') {
      return [
        { label: 'Reviews', value: this.stats.totalReviews },
        {
          label: 'Rating',
          value: this.stats.averageRating?.toFixed(1),
          // icon: 'fas fa-star text-warning',
        },
        { label: 'Months hosting', value: this.stats.monthsHosting },
      ];
    } else {
      return [
        { label: 'Trips', value: this.stats.totalTrips },
        { label: 'Reviews', value: this.stats.totalReviews },
        { label: 'Years on Platform', value: this.stats.yearsOnPlatform },
      ];
    }
  }

  getHostStatus(): string {
    if (this.userType === 'Guest') {
      return this.country || 'Location not specified';
    }

    // For hosts, determine status based on rating
    if (this.stats?.averageRating >= 4.8) {
      return 'Super Host';
    } else {
      return 'Host';
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

  shouldShowImage(
    imageUrl: string | undefined,
    itemId: string | undefined
  ): boolean {
    return !!(
      imageUrl &&
      imageUrl.trim() !== '' &&
      !this.imageErrors.has(itemId)
    );
  }

  shouldShowFallback(
    imageUrl: string | undefined,
    itemId: string | undefined
  ): boolean {
    return !imageUrl || imageUrl.trim() === '' || this.imageErrors.has(itemId);
  }

  getInitials(firstName: string, lastName: string): string {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
  }
}
