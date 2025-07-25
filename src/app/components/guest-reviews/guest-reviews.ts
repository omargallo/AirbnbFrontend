import { CommonModule } from '@angular/common';
import { ReviewService } from '../../core/services/Review/review.service';
import type { Ireview } from './../../core/models/ireview';

import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StarComponent } from '../../shared/components/star-component/star-component';
import { ReviewsModalComponent } from './guest-review-modal/guest-review-modal';
import { AuthService } from '../../core/services/auth.service';
import { BookingDetailsDTO } from '../../core/services/Booking/user-booking-service';

@Component({
  selector: 'app-guest-reviews',
  imports: [CommonModule, RouterLink, StarComponent, ReviewsModalComponent],
  templateUrl: './guest-reviews.html',
  styleUrl: './guest-reviews.css',
})
export class GuestReviews implements OnInit {
  @Input() propertyId?: number;
  @Input() propertyName: string = 'This Property';

  reviews: Ireview[] = [];
  showReviewsModal: boolean = false;

  // User and booking related properties
  userId: string | null = null;
  userExistingReview: boolean = false;
  userCompletedBookings: BookingDetailsDTO[] = [];
  canUserReview: boolean = false;

  showTooltip: boolean = false;

  toggleTooltip(event: Event) {
    event.preventDefault();
    this.showTooltip = !this.showTooltip;

    // Close tooltip when clicking outside
    if (this.showTooltip) {
      setTimeout(() => {
        document.addEventListener(
          'click',
          this.closeTooltipOnOutsideClick.bind(this)
        );
      }, 0);
    }
  }

  private closeTooltipOnOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.learn-container')) {
      this.showTooltip = false;
      this.cdr.detectChanges();
      document.removeEventListener(
        'click',
        this.closeTooltipOnOutsideClick.bind(this)
      );
    }
  }

  openReviewsModal() {
    this.showReviewsModal = true;
  }

  closeReviewsModal() {
    this.showReviewsModal = false;
  }

  // Navigate to add review form
  navigateToAddReview() {
    if (!this.userId || !this.propertyId) {
      console.error(
        'Cannot navigate to add review: User ID or Property ID is missing'
      );
      return;
    }
    // Navigate to review form with propertyId as query parameter
    this.router.navigate(['/reviews/add'], {
      queryParams: {
        propertyId: this.propertyId,
        mode: 'add',
      },
    });
  }

  // Navigate to edit review form
  navigateToEditReview(reviewId: number) {
    this.router.navigate(['/reviews', reviewId, 'edit']);
  }

  // Navigate to view individual review
  navigateToViewReview(reviewId: number) {
    this.router.navigate(['/reviews', reviewId, 'view']);
  }

  constructor(
    private ReviewService: ReviewService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get current user ID
    this.userId = this.authService.userId;

    if (this.propertyId) {
      this.loadReviewsByPropertyId();

      // If user is logged in, check if they can review
      if (this.userId) {
        this.checkUserReviewStatus();
        this.loadUserCompletedBookings();
      }
    } else {
      this.loadAllReviews();
    }
  }

  loadReviewsByPropertyId(): void {
    this.ReviewService.getReviewsByPropertyId(this.propertyId!).subscribe({
      next: (response) => {
        this.reviews = response;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  loadAllReviews(): void {
    this.ReviewService.getAllReviews().subscribe({
      next: (response) => {
        this.reviews = response;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  deleteHandler(reviewId: number) {
    this.ReviewService.deleteReview(reviewId).subscribe({
      next: (response) => {
        this.reviews = this.reviews.filter((review) => review.id != reviewId);
        this.userExistingReview = false;
        this.canUserReview = this.userCompletedBookings.length > 0;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  // Check if the user has already reviewed this property
  checkUserReviewStatus(): void {
    if (!this.userId || !this.propertyId) return;

    this.ReviewService.getReviewsByUserId(this.userId).subscribe({
      next: (reviews) => {
        // Check if user has already reviewed this property
        this.userExistingReview = reviews.some(
          (review) => review.propertyId === this.propertyId
        );
        this.updateCanUserReview();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Error checking user review status:', error);
      },
    });
  }

  // Load user's completed bookings for this property
  loadUserCompletedBookings(): void {
    if (!this.userId || !this.propertyId) return;

    this.ReviewService.getUserCompletedBookingsForProperty(
      this.userId,
      this.propertyId
    ).subscribe({
      next: (bookings) => {
        this.userCompletedBookings = bookings;
        // Check if the last booking for this property is completed
        if (bookings.length > 0) {
          // Sort bookings by checkout date (most recent first)
          const sortedBookings = [...bookings].sort(
            (a, b) =>
              new Date(b.checkOutDate).getTime() -
              new Date(a.checkOutDate).getTime()
          );

          // Get the most recent booking
          const lastBooking = sortedBookings[0];

          // Log the last booking status for debugging
          console.log('Last booking status:', lastBooking.bookingStatus);

          // Only consider completed bookings for review eligibility
          this.userCompletedBookings = sortedBookings.filter(
            (booking) => booking.bookingStatus === 'Completed'
          );
        }

        this.updateCanUserReview();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading user bookings:', error);
      },
    });
  }

  // Update whether the user can review based on bookings and existing reviews
  updateCanUserReview(): void {
    // User can review if they are logged in, have at least one completed booking for this property,
    // and haven't already reviewed this property
    this.canUserReview =
      this.userId !== null &&
      this.userCompletedBookings.length > 0 &&
      !this.userExistingReview;

    // Log review eligibility status for debugging
    console.log('Review eligibility:', {
      userId: this.userId,
      completedBookings: this.userCompletedBookings.length,
      hasExistingReview: this.userExistingReview,
      canReview: this.canUserReview,
    });
  }

  // Helper method for tracking reviews in ngFor
  trackByReviewId(index: number, review: Ireview): number {
    return review.id;
  }

  // Helper methods for user display
  getInitials(firstName?: string, lastName?: string): string {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last || 'U';
  }

  getFullName(firstName?: string, lastName?: string): string {
    return [firstName, lastName].filter(Boolean).join(' ') || 'Anonymous User';
  }
}
