import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PropertyAmenityService } from '../../../core/services/PropertyAmenity/property-amenity.service';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { HttpParams } from '@angular/common/http';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { CalendarAvailability } from '../../../core/models/CalendarAvailability';
import { CalendarAvailabilityService } from '../../../core/services/CalendarAvailability/calendar-availability.service';

// Define interface for the amenity data structure
interface Amenity {
  id: number;
  name: string;
  iconUrl: string;
  // Add other properties if they exist in your API response
}

@Component({
  selector: 'app-amenities-section',
  standalone: true,
  imports: [CommonModule ,NgxDaterangepickerMd,FormsModule],
  templateUrl: './amenities-section.component.html',
  styleUrls: ['./amenities-section.component.css']
})
export class AmenitiesSectionComponent implements OnInit {
  @Input() propertyId!: number;
  amenities: Amenity[] = [];
  isLoading = true;
  showAllAmenities = false;
  readonly INITIAL_DISPLAY_COUNT = 10;


  selected!: { startDate: moment.Moment; endDate: moment.Moment; };
  unavailableDates: string[] = [];
  minDate = moment(); // today
  availabilityMessage = '';
  totalPrice: number = 0;

  constructor(private propertyAmenityService: PropertyAmenityService) { }

  ngOnInit(): void {
    if (!this.propertyId) {
      console.error('Property ID is required for AmenitiesSectionComponent');
      this.isLoading = false;
      return;
    }
    this.loadAmenities();

      this.selected = {
      startDate: moment().add(1, 'days'),
      endDate: moment().add(2, 'days')
    };
    
  } //end oninit

    isUnavailable = (date: moment.Moment): boolean => {
    return this.unavailableDates.includes(date.format('YYYY-MM-DD'));
  };
  

  private loadAmenities(): void {
    this.propertyAmenityService.getAllAmenitiesByPropertyId(this.propertyId).subscribe({
      next: (response: any) => {
        console.log('API response:', response);
        if (Array.isArray(response.data)) {
          this.amenities = response.data.map((item: any) => ({
            id: item.id,
            name: item.amenity?.name || item.name || 'Unknown Amenity',
            iconUrl: this.getFullIconUrl(item.amenity?.iconUrl || item.iconUrl)
          }));
        }
        console.log('Processed amenities:', this.amenities);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load amenities:', err);
        this.isLoading = false;
      }
    });
  }

  getFullIconUrl(url: string): string {
    if (!url) return ''; // fallback icon
    return url.startsWith('http') ? url : `https://localhost:7025${url}`;
  }
 get displayedAmenities(): Amenity[] {
    return this.showAllAmenities
      ? this.amenities
      : this.amenities.slice(0, this.INITIAL_DISPLAY_COUNT);
  }

  get firstColumnAmenities(): Amenity[] {
    const items = this.displayedAmenities;
    return items.slice(0, Math.ceil(items.length / 2));
  }

  get secondColumnAmenities(): Amenity[] {
    const items = this.displayedAmenities;
    return items.slice(Math.ceil(items.length / 2));
  }

  get shouldShowToggle(): boolean {
    return this.amenities.length > this.INITIAL_DISPLAY_COUNT;
  }

  toggleShowAll(): void {
    this.showAllAmenities = !this.showAllAmenities;
    
    // Smooth scroll to top of amenities section when collapsing
    if (!this.showAllAmenities) {
      setTimeout(() => {
        const element = document.querySelector('.amenities-section h2');
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }
    onImageError(event: any): void {
    event.target.src = 'assets/images/default-amenity.svg';
  }



  // TrackBy function for better performance with *ngFor
  trackByAmenityId(index: number, amenity: Amenity): number {
    return amenity.id;
  }






















  // isUnavailable = (date: moment.Moment): boolean => {
  //   return this.unavailableDates.includes(date.format('YYYY-MM-DD'));
  // };

  // Watcher-like approach (optional: call manually on Apply)
  // ngOnChanges(): void {
  //   if (this.selected?.startDate && this.selected?.endDate) {
  //     this.fetchAvailability();
  //   }
  // }

  // fetchAvailability(): void {
  //   const params = new HttpParams()
  //     .set('startDate', this.selected.startDate.toISOString())
  //     .set('endDate', this.selected.endDate.toISOString())
  //     .set('guests', '2'); // You can make this dynamic too

  //   CalendarAvailabilityService.get<CalendarAvailability>(`https://localhost:7025/api/Calendar/property/${this.propertyId}/availability`, { params })
  //     .subscribe((res: { data: { message: string; totalPrice: number; unavailableDates: string[]; }; }) => {
  //       this.availabilityMessage = res.data.message;
  //       this.totalPrice = res.data.totalPrice;
  //       this.unavailableDates = res.data.unavailableDates.map((d: string) =>
  //         moment(d).format('YYYY-MM-DD')
  //       );
  //     });
  // }

}