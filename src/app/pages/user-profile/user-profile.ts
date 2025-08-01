import { UserService } from './../../core/services/Admin/user-service';
import { AuthService } from './../../core/services/auth.service';
import {
  Component,
  OnInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Subject,
  takeUntil,
  catchError,
  of,
  forkJoin,
  combineLatest,
} from 'rxjs';
import { HostReviewDTO } from '../../core/models/ReviewInterfaces/host-review-dto';
import { IGuestReviewDto } from '../../core/models/ReviewInterfaces/guest-review-dto';
import { ReviewService } from '../../core/services/Review/review.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { PropertImageGalaryComponent } from '../PropertyDetails/propertImage-galary/propertImage-galary.component';
import { register } from 'swiper/element/bundle';
import { PropertySwiperComponent } from '../../components/mainswiper/mainswiper';
import { UserProfileDto } from './../../core/models/ReviewInterfaces/guest-review-dto';
register();

@Component({
  selector: 'app-user-profile',
  imports: [
    DecimalPipe,
    CommonModule,
    PropertImageGalaryComponent,
    PropertySwiperComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit, OnDestroy {
  userId: string = '';
  isHost: boolean = false;
  loading: boolean = false;
  error: string | null = null;

  userProfile: any = null;

  hostReviews: HostReviewDTO[] = [];

  guestReviews: IGuestReviewDto[] = [];

  hostStats: {
    totalReviews: number;
    averageRating: number;
    monthsHosting: number;
    totalProperties: number;
  } | null = null;

  guestStats: {
    totalTrips: number;
    totalReviews: number;
    yearsOnPlatform: number;
  } | null = null;

  showHostReviewsModal: boolean = false;
  showHostPropertiesModal: boolean = false;
  showGuestReviewsModal: boolean = false;

  //didn't use it
  profileLoading: boolean = true;
  reviewsLoading: boolean = true;
  statsCalculated: boolean = false;

  // Swiper breakpoints
  reviewsBreakpoints = {
    640: { slidesPerView: 2, spaceBetween: 16 },
    768: { slidesPerView: 3, spaceBetween: 16 },
    1024: { slidesPerView: 4, spaceBetween: 16 },
  };

  visitedPlacesBreakpoints = {
    640: { slidesPerView: 3, spaceBetween: 16 },
    768: { slidesPerView: 4, spaceBetween: 16 },
    1024: { slidesPerView: 6, spaceBetween: 16 },
  };

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];

    if (!this.userId) {
      this.error = 'User ID is required';
      return;
    }

    this.loadAllDataParallel(); //better performance
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAllDataParallel(): void {
    // Load user profile, role check, and reviews all at once
    const userProfile$ = this.userService.getUserProfile(this.userId).pipe(
      catchError((error) => {
        console.error('Error fetching user profile:', error);
        return of(null);
      })
    );

    const isHost$ = this.reviewService.isUserHost(this.userId).pipe(
      catchError((error) => {
        console.error('Error checking user role:', error);
        return of(false);
      })
    );

    const hostReviews$ = this.reviewService
      .getHostReviewsWithProperties(this.userId)
      .pipe(
        catchError((error) => {
          console.error('Error loading host data:', error);
          return of([]);
        })
      );

    const guestReviews$ = this.reviewService
      .getPublicReviewsByUserId(this.userId)
      .pipe(
        catchError((error) => {
          console.error('Error loading guest data:', error);
          return of([]);
        })
      );

    // Execute all requests in parallel
    combineLatest([userProfile$, isHost$, hostReviews$, guestReviews$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([profile, isHost, hostReviews, guestReviews]) => {
        this.userProfile = profile;
        this.profileLoading = false;

        this.isHost = isHost;
        this.hostReviews = hostReviews || [];
        this.guestReviews = guestReviews || [];

        this.reviewsLoading = false;

        this.calculateAllStats();
      });
  }

  private calculateAllStats(): void {
    if (this.isHost) {
      this.calculateHostStats();
    } else {
      this.calculateGuestStats();
    }
    this.statsCalculated = true;
  }

  private calculateHostStats(): void {
    if (this.hostReviews.length === 0) {
      this.hostStats = {
        totalReviews: 0,
        averageRating: 0,
        monthsHosting: 0,
        totalProperties: 0,
      };
      return;
    }

    const totalRating = this.hostReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRating / this.hostReviews.length;

    const oldestReview = this.hostReviews.reduce((oldest, review) =>
      new Date(review.createdAt) < new Date(oldest.createdAt) ? review : oldest
    );
    const monthsHosting = Math.ceil(
      (Date.now() - new Date(oldestReview.createdAt).getTime()) /
        (1000 * 60 * 60 * 24 * 30)
    );

    this.hostStats = {
      totalReviews: this.hostReviews.length,
      averageRating: averageRating,
      monthsHosting: monthsHosting,
      totalProperties: this.uniqueHostProperties.length,
    };
  }

  private calculateGuestStats(): void {
    if (this.guestReviews.length === 0) {
      this.guestStats = {
        totalTrips: 0,
        totalReviews: 0,
        yearsOnPlatform: 0,
      };
      return;
    }

    const oldestReview = this.guestReviews.reduce((oldest, review) =>
      new Date(review.createdAt) < new Date(oldest.createdAt) ? review : oldest
    );
    const yearsOnPlatform = Math.ceil(
      (Date.now() - new Date(oldestReview.createdAt).getTime()) /
        (1000 * 60 * 60 * 24 * 365)
    );

    this.guestStats = {
      totalTrips: this.uniqueVisitedProperties.length,
      totalReviews: this.guestReviews.length,
      yearsOnPlatform: yearsOnPlatform,
    };
  }

  getBirthDecade(): string {
    if (!this.userProfile?.birthDate) return '';
    const birthYear = new Date(this.userProfile.birthDate).getFullYear();
    const decade = Math.floor(birthYear / 10) * 10;
    return `Born in the ${decade}s`;
  }

  private _uniqueHostProperties: any[] | null = null;
  get uniqueHostProperties() {
    if (this._uniqueHostProperties === null) {
      const propertyMap = new Map();
      this.hostReviews.forEach((review) => {
        if (review.property && !propertyMap.has(review.property.id)) {
          propertyMap.set(review.property.id, review.property);
        }
      });
      this._uniqueHostProperties = Array.from(propertyMap.values());
    }
    return this._uniqueHostProperties;
  }

  private _uniqueVisitedProperties: any[] | null = null;
  get uniqueVisitedProperties() {
    if (this._uniqueVisitedProperties === null) {
      const propertyMap = new Map();
      this.guestReviews.forEach((review) => {
        if (!propertyMap.has(review.propertyId)) {
          propertyMap.set(review.propertyId, {
            id: review.propertyId,
          });
        }
      });
      this._uniqueVisitedProperties = Array.from(propertyMap.values());
    }
    return this._uniqueVisitedProperties;
  }

  navigateToProperty(propertyId: number): void {
    if (!propertyId) {
      console.warn('Property ID is required for navigation');
      return;
    }
    this.router.navigate(['/property', propertyId]);
  }

  onPropertyClicked(propertyId: number): void {
    this.navigateToProperty(propertyId);
  }

  onWishlistClick(propertyId: number): void {
    console.log('Wishlist clicked for property:', propertyId);
  }

  openHostReviewsModal(): void {
    this.showHostReviewsModal = true;
  }

  closeHostReviewsModal(): void {
    this.showHostReviewsModal = false;
  }

  openHostPropertiesModal(): void {
    this.showHostPropertiesModal = true;
  }

  closeHostPropertiesModal(): void {
    this.showHostPropertiesModal = false;
  }

  openGuestReviewsModal(): void {
    this.showGuestReviewsModal = true;
  }

  closeGuestReviewsModal(): void {
    this.showGuestReviewsModal = false;
  }

  getStarArray(rating: number): number[] {
    if (!rating || rating < 0) return [];
    return Array(Math.floor(Math.min(rating, 5))).fill(0);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.warn('Invalid date string:', dateString);
      return '';
    }
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }

  retryLoadData(): void {
    this.profileLoading = true;
    this.reviewsLoading = true;
    this.statsCalculated = false;
    this.error = null;

    this._uniqueHostProperties = null;
    this._uniqueVisitedProperties = null;

    this.loadAllDataParallel();
  }

  get hasHostReviews(): boolean {
    return this.hostReviews.length > 0;
  }

  get hasGuestReviews(): boolean {
    return this.guestReviews.length > 0;
  }

  get hasHostProperties(): boolean {
    return this.uniqueHostProperties.length > 0;
  }

  get hasVisitedProperties(): boolean {
    return this.uniqueVisitedProperties.length > 0;
  }

  get canShowProfile(): boolean {
    return !this.profileLoading && this.userProfile !== null;
  }

  get canShowReviews(): boolean {
    return !this.reviewsLoading;
  }

  get canShowStats(): boolean {
    return (
      this.statsCalculated &&
      (this.hostStats !== null || this.guestStats !== null)
    );
  }

  getAverageRatingForProperty(propertyId: number): number {
    const propertyReviews = this.hostReviews.filter(
      (review) => review.propertyId === propertyId
    );
    if (propertyReviews.length === 0) return 0;

    const totalRating = propertyReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return totalRating / propertyReviews.length;
  }

  getReviewCountForProperty(propertyId: number): number {
    return this.hostReviews.filter((review) => review.propertyId === propertyId)
      .length;
  }

  getReviewsForProperty(propertyId: number): HostReviewDTO[] {
    return this.hostReviews.filter(
      (review) => review.propertyId === propertyId
    );
  }
}
