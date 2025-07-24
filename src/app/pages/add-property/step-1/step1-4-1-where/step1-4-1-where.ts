import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PropertyFormStorageService } from '../../../../core/services/ListingWizard/property-form-storage.service';
import { ListingWizardService } from '../../../../core/services/ListingWizard/listing-wizard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-step1-4-where',
  imports: [FormsModule],
  templateUrl: './step1-4-1-where.html',
  styleUrl: './step1-4-1-where.css'
})
export class Step14Where implements OnInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private subscription!: Subscription;
  private map: google.maps.Map | null = null;
  private marker: google.maps.Marker | null = null;
  private geocoder: google.maps.Geocoder = new google.maps.Geocoder();

  // Address entered by the user
  address: string = '';
  latitude: number = 26.82055;
  longitude: number = 30.8025;

  constructor(
    private formStorage: PropertyFormStorageService,
    private wizardService: ListingWizardService
  ) {}

  ngOnInit(): void {
    // Load saved data
    const savedData = this.formStorage.getStepData('step1-4-1');
    if (savedData) {
      this.address = savedData.address || '';
      this.latitude = savedData.latitude || 26.82055;
      this.longitude = savedData.longitude || 30.8025;
    }

    // Subscribe to next step event
    this.subscription = this.wizardService.nextStep$.subscribe(() => {
      this.saveFormData();
    });

    // Initialize map after view is ready
    setTimeout(() => this.initMap(), 100);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Initialize Google Map
  private initMap(): void {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    // Add marker at current position
    this.marker = new google.maps.Marker({
      position: { lat: this.latitude, lng: this.longitude },
      map: this.map,
      draggable: true
    });

    // Listen for marker drag events
    this.marker.addListener('dragend', () => {
      const position = this.marker?.getPosition();
      if (position) {
        this.latitude = position.lat();
        this.longitude = position.lng();
        this.updateAddressFromCoordinates(position);
      }
    });

    // Listen for map clicks
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      const position = event.latLng;
      if (position) {
        this.marker?.setPosition(position);
        this.latitude = position.lat();
        this.longitude = position.lng();
        this.updateAddressFromCoordinates(position);
      }
    });
  }

  // Method to handle address input changes
  onAddressChange(newAddress: string): void {
    this.address = newAddress;
    this.geocodeAddress();
  }

  // Geocode address to coordinates
  private geocodeAddress(): void {
    if (!this.address) return;

    this.geocoder.geocode({ address: this.address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        this.latitude = location.lat();
        this.longitude = location.lng();
        
        if (this.map && this.marker) {
          this.map.setCenter(location);
          this.marker.setPosition(location);
        }
        
        this.saveFormData();
      }
    });
  }

  // Update address from coordinates using reverse geocoding
  private updateAddressFromCoordinates(position: google.maps.LatLng): void {
    this.geocoder.geocode({ location: position }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        this.address = results[0].formatted_address;
        this.saveFormData();
      }
    });
  }

  getCurrentLocation(): void {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        const latLng = new google.maps.LatLng(this.latitude, this.longitude);
        
        if (this.map && this.marker) {
          this.map.setCenter(latLng);
          this.map.setZoom(15);
          this.marker.setPosition(latLng);
        }

        this.updateAddressFromCoordinates(latLng);
      },
      (error) => {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert('Please allow access to your location to use this feature');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable');
            break;
          case error.TIMEOUT:
            alert('The request to get user location timed out');
            break;
          default:
            alert('An unknown error occurred');
            break;
        }
      }
    );
  }

  private saveFormData(): void {
    const data = {
      address: this.address,
      latitude: this.latitude,
      longitude: this.longitude
    };
    this.formStorage.saveFormData('step1-4-1', data);
  }
}
