import { PropertyService } from './../../core/services/Property/property.service';
import { PropertyDisplayWithHostDataDto } from './../../pages/add-property/models/property.model';
import { Property } from './../../core/models/Property';

import { UserBookingService } from './../../core/services/Booking/user-booking-service';
import { Confirm } from './../../shared/components/confirm/confirm';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../core/services/Review/review.service';
import { IGuestReviewDto } from './../../core/models/ReviewInterfaces/guest-review-dto';

import {
  ChangeDetectorRef,
  Component,
  input,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StarComponent } from '../../shared/components/star-component/star-component';

import { AuthService } from '../../core/services/auth.service';
import { BookingDetailsDTO } from '../../core/services/Booking/user-booking-service';

import { Button } from '../../shared/components/button/button';
import { ConfirmService } from '../../core/services/confirm.service';
import { Modal } from '../../shared/components/modal/modal';
import { ReviewsModalComponent } from './guest-review-modal/guest-review-modal';
import { environment } from '../../../environments/environment.development';
import { HostReviewDTO } from '../../core/models/ReviewInterfaces/host-review-dto';
import { ProfileCard } from '../../shared/components/profile-card/profile-card';

@Component({
  selector: 'app-guest-reviews',
  standalone: true,
  imports: [
    CommonModule,
    StarComponent,
    //ReviewsModalComponent ,
    // Confirm,
    //  Modal,
    ReviewsModalComponent,
    ProfileCard,
  ],
  templateUrl: './guest-reviews.html',
  styleUrl: './guest-reviews.css',
})
export class GuestReviews implements OnInit {
  @Input() propertyId!: number;

  // @Input() propertyName: string = 'This Property';
  //@Input() userbookings: any[] = [];

  currentUser: any = null;

  // reviews: Ireview[] = [];
  reviews: IGuestReviewDto[] = [];
  showReviewsModal: boolean = false;

  // userExistingReview: boolean = false;

  userBookings: BookingDetailsDTO[] = [];

  currentBookingId = 0;

  showTooltip: boolean = false;

  isLoadingBookings: boolean = false;

  showReviewForm = false; //  for performance optimization only i think

  constructor(
    private confirmService: ConfirmService,
    private ReviewService: ReviewService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router,
    private UserBookingService: UserBookingService,
    private PropertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.userId;
    this.loadHostInfo();
    // this.loadUserCompletedBookings();

    if (this.propertyId) {
      this.loadReviewsByPropertyId();

      //for profile card
      //    this.loadHostInformation();
      //

      if (this.currentUser) {
        //this.checkUserReviewEligibility();
        this.loadUserBookings();
      }
    }

    // else {
    //   this.loadAllReviews();
    // }
  }

  public imageBaseUrl = environment.baseUrl.replace('/api', '');

  getImageUrl(profilePictureURL: string): string {
    return this.imageBaseUrl + profilePictureURL;
  }

  imageError: Set<string | undefined> = new Set();
  imageErrors: Set<number> = new Set();

  onImageError(event: any, review: IGuestReviewDto): void {
    this.imageError.add(review.id.toString());
  }

  getOverallRating(): number {
    if (this.reviews.length === 0) return 0;
    const totalRating = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return totalRating / this.reviews.length;
  }

  openReviewsModal(): void {
    this.showReviewsModal = true;
  }

  closeReviewsModal(): void {
    this.showReviewsModal = false;
  }

  trackByReviewId(index: number, review: IGuestReviewDto): number {
    return review.id;
  }

  //first get user id
  // getCurrentUser(): any {
  //   const userId = this.authService.userId;
  //   return userId ? userId : null;
  // }

  loadUserBookings(): void {
    if (!this.currentUser) return;

    this.isLoadingBookings = true;
    this.UserBookingService.getBookingsByUserId(this.currentUser).subscribe({
      next: (bookings) => {
        this.userBookings = bookings;
        this.isLoadingBookings = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading user bookings:', error);
        this.isLoadingBookings = false;
      },
    });
  }

  //then check if there's one who booked show the review button
  // Check if user is logged in using AuthService
  shouldShowReviewButton(): boolean {
    // console.log('Checking if review button should be shown');

    if (!this.currentUser) {
      // console.log('No current user found.');

      return false;
    } else {
      // console.log('Current user:', this.currentUser);
    }

    if (this.isLoadingBookings) {
      // console.log('Bookings are still loading.');
      return false;
    } else {
      // console.log('Bookings loaded:', this.userBookings);
    }

    const hasCompletedBooking = this.userBookings.some(
      (booking) =>
        booking.propertyId === this.propertyId &&
        booking.bookingStatus === 'Completed'
    );
    // console.log('Has completed booking for property:', hasCompletedBooking);

    if (!hasCompletedBooking) {
      return false;
    }

    const hasExistingReview = this.reviews.some(
      (review) => review.user.userId === this.currentUser
    );

    // console.log('Has existing review from user:', hasExistingReview);

    if (hasExistingReview) {
      return false;
    }

    // console.log('All checks passed. Show review button.');
    return true;
  }
  // hasExistingReview(): boolean {
  //   return this.reviews.some((review) => review.userId === this.currentUser);
  // }

  hasExistingReview(): boolean {
    console.log('Current User:', this.currentUser, typeof this.currentUser);
    console.log(
      'Reviews with userIds:',
      this.reviews.map((r) => ({
        id: r.id,
        userId: r.user.userId,
        userIdType: typeof r.user.userId,
      }))
    );

    return this.reviews.some((review) => {
      const match = String(review.user.userId) === String(this.currentUser);
      console.log(
        `Comparing: "${review.user.userId}" === "${this.currentUser}" = ${match}`
      );
      return match;
    });
  }
  getCompletedBookingForProperty(): BookingDetailsDTO | null {
    return (
      this.userBookings
        .filter(
          (booking) =>
            booking.propertyId === this.propertyId &&
            booking.bookingStatus === 'Completed'
        )
        .sort(
          (a, b) =>
            new Date(b.checkOutDate).getTime() -
            new Date(a.checkOutDate).getTime()
        )[0] || null
    );
  }

  toggleTooltip(event: Event) {
    event.preventDefault();
    this.showTooltip = !this.showTooltip;

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
  navigateToReviewerProfile(userId: string): void {
    if (userId) {
      this.router.navigate(['/user', userId]);
    }
  }
  navigateToAddReview() {
    this.router.navigate(['/review/0'], {
      queryParams: {
        propertyId: this.propertyId,
        mode: 'add',
      },
    });
  }

  navigateToEditReview(review: IGuestReviewDto) {
    this.router.navigate(['/review', review.id], {
      state: { reviewData: review },

      queryParams: {
        mode: 'edit',
      },
    });
  }

  loadReviewsByPropertyId(): void {
    if (!this.propertyId) return;

    this.ReviewService.getReviewsByPropertyId(this.propertyId!).subscribe({
      next: (response) => {
        console.log('Raw API Response:', response);
        console.log('First review object:', response[0]);
        console.log('Keys in first review:', Object.keys(response[0] || {}));

        this.reviews = response;
        // this.checkUserExistingReview();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 50);
      },
      error: (e) => {
        console.error('Error loading reviews:', e);
      },
    });
  }

  // loadAllReviews(): void {
  //   this.ReviewService.getAllReviews().subscribe({
  //     next: (response) => {
  //       this.reviews = response;
  //       this.cdr.detectChanges();
  //     },
  //     error: (e) => {
  //       console.log(e);
  //     },
  //   });
  // }

  // performDelete(reviewId: number) {
  //   this.ReviewService.deleteReview(reviewId).subscribe({
  //     next: () => {
  //       //     this.reviews = this.reviews.filter((review) => review.id !== reviewId);
  //       // this.userExistingReview = false;
  //       // Recheck eligibility after deletion
  //       // this.checkUserReviewEligibility();
  //       this.reviews = this.reviews.filter((review) => review.id !== reviewId);

  //       this.cdr.detectChanges();

  //       //   this.cdr.detectChanges();
  //     },
  //     error: (error) => {
  //       console.error('Delete failed:', error);
  //     },
  //   });
  // }
  performDelete(reviewId: number) {
    // Optimistically update UI first
    this.reviews = this.reviews.filter((review) => review.id !== reviewId);
    this.cdr.detectChanges();

    this.ReviewService.deleteReview(reviewId).subscribe({
      next: () => {
        // Already filtered above
        console.log('Review deleted successfully');
      },
      error: (error) => {
        console.error('Delete failed:', error);
        // Revert the UI change on error
        this.loadReviewsByPropertyId();
      },
    });
  }
  deleteHandler(reviewId: number) {
    this.confirmService.show(
      'Delete Your Review?',
      'Are you sure you want to delete this review? This action cannot be undone.',
      () => this.performDelete(reviewId),
      {
        okText: 'Delete',
        cancelText: 'Cancel',
        isSuccess: false,
      }
    );
  }

  //   isCurrentUserReview(review: IGuestReviewDto): boolean {
  //   return this.currentUser === review.UserId;
  // }

  // Optional: Get user profile link for now after the profile is made it won't be optional
  getUserProfileLink(userId: string): string {
    return `/user/${userId}`;
  }

  // Helper methods for user display
  getInitials(firstName?: string, lastName?: string): string {
    if (!firstName && !lastName) {
      return 'U'; // Default for unknown user
    }

    const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';

    return firstInitial + lastInitial;
  }

  getFullName(firstName?: string, lastName?: string): string {
    if (!firstName && !lastName) {
      return 'Anonymous User';
    }

    return `${firstName || ''} ${lastName || ''}`.trim();
  }

  //Aggregate ratings for the property

  getRatingPercentage(rating: number): number {
    // Calculate percentage based on rating distribution
    const total = this.reviews.length;
    const count = this.reviews.filter(
      (r) => Math.floor(r.rating) === rating
    ).length;
    return total > 0 ? (count / total) * 100 : 0;
  }

  get ratingDistribution(): { [key: number]: number } {
    const distribution: { [key: number]: number } = {};
    for (let i = 1; i <= 5; i++) {
      distribution[i] = this.reviews.filter(
        (r) => Math.floor(r.rating) === i
      ).length;
    }
    return distribution;
  }

  get categoryAverages(): { [key: string]: number } {
    if (this.reviews.length === 0) return {};

    const categories = [
      'cleanliness',
      'accuracy',
      'checkIn', // Note: this should match your DTO property name

      'communication',
      'location',
      'value',
    ];
    const averages: { [key: string]: number } = {};

    categories.forEach((category) => {
      const sum = this.reviews.reduce((acc, review) => {
        const value = review[category as keyof IGuestReviewDto] as number;
        return acc + (value || 0); // Handle null/undefined values
      }, 0);
      averages[category] =
        this.reviews.length > 0
          ? Number((sum / this.reviews.length).toFixed(1))
          : 0;
    });

    return averages;
  }
  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      cleanliness: 'bi-droplet', // or 'bi-house-check'
      accuracy: 'bi-check-circle',
      checkIn: 'bi-key',
      communication: 'bi-chat-square-dots',
      location: 'bi-geo-alt',
      value: 'bi-tag',
    };
    return icons[category.toLowerCase()] || 'bi-star';
  }
  getCleanlinessRatings(): number[] {
    return this.reviews
      .map((r) => r.cleanliness)
      .filter((c): c is number => c !== null && c !== undefined);
  }

  cleanlinessRatings = this.getCleanlinessRatings();

  averageCleanliness =
    this.cleanlinessRatings.reduce((sum, value) => sum + value, 0) /
    (this.cleanlinessRatings.length || 1);

  //for profile card

  hostInfo: any = null;
  hostStats: any = null;
  isLoadingHost: boolean = false;

  // Update your loadHostInformation method in GuestReviews component

  loadHostInfo(): void {
    if (!this.propertyId) return;

    this.isLoadingHost = true;

    this.PropertyService.getPropertyWithHostData(this.propertyId).subscribe({
      next: (property: PropertyDisplayWithHostDataDto) => {
        console.log('Property with host data:', property);

        this.hostInfo = {
          userId: property.host?.userId || property.hostId,
          firstName: property.host?.firstName || 'Host',
          lastName: property.host?.lastName || '',
          userName: property.host?.userName,
          email: property.host?.email,
          phoneNumber: property.host?.phoneNumber,
          profilePictureURL: property.host?.profilePictureURL,
          country: property.host?.country || property.country,
          description: property.host?.bio, // bio maps to description
          birthDate: property.host?.birthDate,
        };

        this.loadAllHostReviewsForStats(
          property.host?.userId || property.hostId
        );

        // this.calculateSimpleHostStats();

        this.isLoadingHost = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading host info:', error);
        this.isLoadingHost = false;
      },
    });
  }
  loadAllHostReviewsForStats(hostId: string): void {
    this.ReviewService.getHostReviewsWithProperties(hostId).subscribe({
      next: (allHostReviews: HostReviewDTO[]) => {
        this.calculateAccurateHostStats(allHostReviews);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading all host reviews:', error);
        // Fallback to simple calculation if this fails
        this.calculateSimpleHostStats();
      },
    });
  }
  calculateAccurateHostStats(allHostReviews: HostReviewDTO[]): void {
    if (allHostReviews.length === 0) {
      this.hostStats = {
        totalReviews: 0,
        averageRating: 0,
        monthsHosting: 1,
        totalProperties: 0,
      };
      return;
    }

    const totalRating = allHostReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRating / allHostReviews.length;

    // Calculate months hosting from oldest review
    const oldestReview = allHostReviews.reduce((oldest, review) =>
      new Date(review.createdAt) < new Date(oldest.createdAt) ? review : oldest
    );
    const monthsHosting = Math.ceil(
      (Date.now() - new Date(oldestReview.createdAt).getTime()) /
        (1000 * 60 * 60 * 24 * 30)
    );

    // Count unique properties
    const uniqueProperties = new Set(
      allHostReviews.map((review) => review.propertyId)
    );

    this.hostStats = {
      totalReviews: allHostReviews.length,
      averageRating: Number(averageRating.toFixed(1)),
      monthsHosting: monthsHosting,
      totalProperties: uniqueProperties.size,
    };
  }
  calculateSimpleHostStats(): void {
    // Simple calculation from current reviews
    const hostReviews = this.reviews.length;
    const totalRating = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = hostReviews > 0 ? totalRating / hostReviews : 0;

    // Simple months calculation (assume 1 months if no specific data)
    const monthsHosting = 1;

    this.hostStats = {
      totalReviews: hostReviews,
      averageRating: Number(averageRating.toFixed(1)),
      monthsHosting: monthsHosting,
    };
  }

  onHostImageError = (event: any, item: any): void => {
    this.imageErrors.add(item.id);
    this.cdr.detectChanges();
  };

  isHostSuperhost(): boolean {
    return (
      this.hostStats?.averageRating >= 4.8 && this.hostStats?.totalReviews >= 5
    );
  }

  getDaysAgo(dateString: string): string {
    const reviewDate = new Date(dateString);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - reviewDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    if (daysDifference === 0) {
      return 'Today';
    } else if (daysDifference === 1) {
      return '1 day ago';
    } else if (daysDifference < 7) {
      return `${daysDifference} days ago`;
    } else if (daysDifference < 14) {
      return '1 week ago';
    } else if (daysDifference < 30) {
      const weeksAgo = Math.floor(daysDifference / 7);
      return `${weeksAgo} weeks ago`;
    } else if (daysDifference < 365) {
      const monthsAgo = Math.floor(daysDifference / 30);
      return monthsAgo === 1 ? '1 month ago' : `${monthsAgo} months ago`;
    } else {
      const yearsAgo = Math.floor(daysDifference / 365);
      return yearsAgo === 1 ? '1 year ago' : `${yearsAgo} years ago`;
    }
  }

  getStayDuration(review: IGuestReviewDto): string {
    if (this.userBookings && this.userBookings.length > 0) {
      const booking = this.userBookings.find(
        (b) =>
          b.propertyId === this.propertyId && b.userId === review.user.userId
      );

      if (booking) {
        return this.calculateStayText(
          booking.checkInDate,
          booking.checkOutDate
        );
      }
    }
    return 'Guest stay';
  }

  private calculateStayText(checkInDate: string, checkOutDate: string): string {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDifference = checkOut.getTime() - checkIn.getTime();
    const nights = Math.floor(timeDifference / (1000 * 3600 * 24));

    if (nights === 1) {
      return 'Stayed 1 night';
    } else if (nights === 2) {
      return 'Stayed a couple nights';
    } else if (nights <= 4) {
      return 'Stayed a few nights';
    } else if (nights <= 7) {
      return 'Stayed a week';
    } else if (nights <= 14) {
      return 'Stayed a couple weeks';
    } else if (nights <= 30) {
      return 'Stayed a few weeks';
    } else {
      return 'Extended stay';
    }
  }
}

// loadUserCompletedBookings(): void {
//   if (!this.userId || !this.propertyId) return;

//   this.ReviewService.getUserCompletedBookingsForProperty(
//     this.userId,
//     this.propertyId
//   ).subscribe({
//     next: (bookings) => {
//       this.userCompletedBookings = bookings;
//       this.cdr.detectChanges();
//     },
//     error: (error) => {
//       console.error('Error loading user bookings:', error);
//     },
//   });
// }

// // Helper method for tracking reviews in ngFor
// trackByReviewId(index: number, review: Ireview): number {
//   return review.Id;
// }
// onReviewSubmitted(): void {
//   this.showReviewForm = false;
//   this.currentBookingId = 0;
//   this.loadReviews(); // Refresh the reviews list
//   // Optional: Show success message
//   console.log('Review submitted successfully!');
// }

// onReviewFormClosed(): void {
//   this.showReviewForm = false;
//   this.currentBookingId = 0;
// }

// openReviewForm(): void {
//   const completedBooking = this.getCompletedBookingForProperty();

//   if (completedBooking && !this.hasExistingReview()) {
//     this.currentBookingId = completedBooking.id;
//     this.showReviewForm = true;
//   }
// }

//MY NEW CODE
// shouldShowReviewButton(): boolean {
//   if (!this.currentUser) {
//     return false;
//   }

//   return true;
// }

// openReviewsModal() {
//   this.showReviewsModal = true;
// }

// closeReviewsModal() {
//   this.showReviewsModal = false;
// }
// Check if user can review using the backend endpoint
// checkUserReviewEligibility(): void {
//   if (!this.userId || !this.propertyId) return;

//   this.ReviewService.canUserReview(this.propertyId).subscribe({
//     next: (canReview) => {
//       this.canUserReview = canReview;
//       this.cdr.detectChanges();
//     },
//     error: (error) => {
//       console.error('Error checking review eligibility:', error);
//       this.canUserReview = false;
//     },
//   });
// }

// Check if user has already reviewed this property
// checkUserExistingReview(): void {
//   if (!this.userId || !this.propertyId) return;

//   this.userExistingReview = this.reviews.some(
//     (review) => review.UserId === this.userId
//   );

//   // Update canUserReview based on existing review
//   if (this.userExistingReview) {
//     this.canUserReview = false;
//   }
// }

// getFullName(firstName?: string, lastName?: string): string {
//   if (firstName || lastName) {
//     return `${firstName || ''} ${lastName || ''}`.trim() || 'Anonymous User';
//   }

//   // Fallback to current user info from localStorage
//   const storedUser = localStorage.getItem('user');
//   if (!storedUser) return 'Anonymous User';

//   const user = JSON.parse(storedUser);
//   return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous User';
// }

//   // Add this method that seems to be missing from your template
//   getStarArray(rating: number): ('full' | 'half' | 'empty')[] {
//     const stars: ('full' | 'half' | 'empty')[] = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;

//     for (let i = 0; i < 5; i++) {
//       if (i < fullStars) {
//         stars.push('full');
//       } else if (i === fullStars && hasHalfStar) {
//         stars.push('half');
//       } else {
//         stars.push('empty');
//       }
//     }

//     return stars;
//   }

//   // Calculate overall rating for the main section
//   getOverallRating(): number {
//     if (this.reviews.length === 0) return 0;

//     const validRatings = this.reviews.filter(
//       (r) => r.Rating != null && !isNaN(r.Rating)
//     );

//     if (validRatings.length === 0) return 0;

//     const totalRating = validRatings.reduce(
//       (sum, review) => sum + review.Rating,
//       0
//     );

//     return Math.round((totalRating / validRatings.length) * 10) / 10;
//   }

//   // Calculate category averages for the main section
//   getCategoryAverage(category: keyof Ireview): number {
//     if (this.reviews.length === 0) return 0;

//     const validReviews = this.reviews.filter(
//       (r) =>
//         r[category] != null &&
//         !isNaN(r[category] as number) &&
//         (r[category] as number) >= 0
//     );

//     if (validReviews.length === 0) return 0;

//     const total = validReviews.reduce(
//       (sum, r) => sum + (r[category] as number),
//       0
//     );

//     return Math.round((total / validReviews.length) * 10) / 10;
//   }

//   // Get rating percentage for a specific star rating
//   getRatingPercentage(rating: number): number {
//     if (this.reviews.length === 0) return 0;

//     const count = this.reviews.filter(
//       (r) =>
//         r.Rating != null && !isNaN(r.Rating) && Math.round(r.Rating) === rating
//     ).length;

//     return Math.round((count / this.reviews.length) * 100);
//   }
