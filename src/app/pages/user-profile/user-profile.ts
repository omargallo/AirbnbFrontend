import { UserService } from './../../core/services/Admin/user-service';
import { AuthService } from './../../core/services/auth.service';
import {
  Component,
  OnInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef,
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
import { environment } from '../../../environments/environment.development';
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

  private imageBaseUrl = environment.baseUrl.replace('/api', '');
  imageErrors: Set<string | undefined> = new Set();

  // Add these methods at the end of your class (before the closing brace)
  getImageUrl(profilePictureURL: string | undefined): string {
    if (!profilePictureURL) {
      return ''; // Return empty string for undefined/null values
    }
    return this.imageBaseUrl + profilePictureURL;
  }

  onImageError(event: any, item: any): void {
    if (item && item.id) {
      this.imageErrors.add(item.id);
    }
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
  //the idea of it to show the initials of the user if the image is not available :)
  getInitials(firstName: string, lastName: string): string {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
  }
  getTimeAgo(dateString: string): string {
    if (!dateString) return '';

    try {
      const now = new Date();
      const date = new Date(dateString);
      const diffInMs = now.getTime() - date.getTime();
      const diffInSeconds = Math.floor(diffInMs / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      const diffInWeeks = Math.floor(diffInDays / 7);
      const diffInMonths = Math.floor(diffInDays / 30);
      const diffInYears = Math.floor(diffInDays / 365);

      if (diffInYears > 0) {
        return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
      } else if (diffInMonths > 0) {
        return diffInMonths === 1
          ? '1 month ago'
          : `${diffInMonths} months ago`;
      } else if (diffInWeeks > 0) {
        return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
      } else if (diffInDays > 0) {
        return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
      } else if (diffInHours > 0) {
        return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
      } else if (diffInMinutes > 0) {
        return diffInMinutes === 1
          ? '1 minute ago'
          : `${diffInMinutes} minutes ago`;
      } else {
        return 'Just now';
      }
    } catch (error) {
      console.warn('Invalid date string:', dateString);
      return '';
    }
  }
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
  @ViewChild('reviewsContainer', { static: false })
  reviewsContainer!: ElementRef;
  @ViewChild('listingsContainer', { static: false })
  listingsContainer!: ElementRef;

  // listingsContainer!: ElementRef;

  private currentScrollPosition = 0;
  private reviewCardWidth = 280; // Card width from template
  private reviewGap = 12; // Gap between cards (from gap-3 = 12px)
  private scrollStep = this.reviewCardWidth + this.reviewGap; // 292px total

  // For Listings Carousel
  private listingsScrollPosition = 0;
  private listingsCardWidth = 240; // Card width from template
  private listingsGap = 12; // Gap between cards
  private listingsScrollStep = this.listingsCardWidth + this.listingsGap; // 252px total

  // Alternative: You can also calculate scroll step dynamically
  // This is useful if you want to scroll multiple cards at once
  private getReviewScrollStep(): number {
    return this.reviewCardWidth + this.reviewGap; // Scroll one card
    // OR: return (this.reviewCardWidth + this.reviewGap) * 2; // Scroll two cards
  }

  private getListingsScrollStep(): number {
    return this.listingsCardWidth + this.listingsGap; // Scroll one card
    // OR: return (this.listingsCardWidth + this.listingsGap) * 3; // Scroll three cards
  }

  scrollReviews(direction: 'left' | 'right'): void {
    if (!this.reviewsContainer) return;

    const container = this.reviewsContainer.nativeElement;
    const containerWidth = container.parentElement.clientWidth;
    const totalWidth = container.scrollWidth;
    const maxScroll = totalWidth - containerWidth;

    if (direction === 'right') {
      this.currentScrollPosition = Math.min(
        this.currentScrollPosition + this.scrollStep, // or this.getReviewScrollStep()
        maxScroll
      );
    } else {
      this.currentScrollPosition = Math.max(
        this.currentScrollPosition - this.scrollStep, // or this.getReviewScrollStep()
        0
      );
    }

    container.style.transform = `translateX(-${this.currentScrollPosition}px)`;
    container.style.transition = 'transform 0.3s ease';
  }

  scrollListings(direction: 'left' | 'right'): void {
    if (!this.listingsContainer) return;

    const container = this.listingsContainer.nativeElement;
    const containerWidth = container.parentElement.clientWidth;
    const totalWidth = container.scrollWidth;
    const maxScroll = totalWidth - containerWidth;

    if (direction === 'right') {
      this.listingsScrollPosition = Math.min(
        this.listingsScrollPosition + this.listingsScrollStep,
        maxScroll
      );
    } else {
      this.listingsScrollPosition = Math.max(
        this.listingsScrollPosition - this.listingsScrollStep,
        0
      );
    }

    container.style.transform = `translateX(-${this.listingsScrollPosition}px)`;
    container.style.transition = 'transform 0.3s ease';
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
    if (!this.hostReviews || this.hostReviews.length === 0) {
      return [];
    }

    const propertyMap = new Map();
    this.hostReviews.forEach((review) => {
      if (
        review.property &&
        review.property.id &&
        !propertyMap.has(review.property.id)
      ) {
        propertyMap.set(review.property.id, review.property);
      }
    });

    return Array.from(propertyMap.values());
  }

  debugApiResponse(): void {
    console.log('=== API RESPONSE DEBUG ===');

    // Call the API directly to see raw response
    this.reviewService.getHostReviewsWithProperties(this.userId).subscribe({
      next: (response) => {
        console.log('Raw API Response:', response);
        console.log('Response type:', typeof response);
        console.log('Is Array:', Array.isArray(response));
        if (Array.isArray(response) && response.length > 0) {
          console.log('First item structure:', response[0]);
          console.log('First item keys:', Object.keys(response[0]));
        }
      },
      error: (error) => {
        console.error('API Error:', error);
      },
    });

    console.log('=== END API DEBUG ===');
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
  activeTab: 'guests' | 'hosts' = 'guests';
  switchTab(tab: 'guests' | 'hosts'): void {
    this.activeTab = tab;
  }

  get filteredReviews() {
    return this.activeTab === 'guests' ? this.hostReviews : [];
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
