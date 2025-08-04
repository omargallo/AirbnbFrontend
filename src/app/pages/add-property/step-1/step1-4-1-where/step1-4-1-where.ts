import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListingWizardService } from '../../../../core/services/ListingWizard/listing-wizard.service';
import { debounceTime, Subscription, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Icon } from 'leaflet';
import { PropertyFormStorageService } from '../../services/property-form-storage.service';
import { ListingValidationService } from '../../../../core/services/ListingWizard/listing-validation.service';

// Fix for default Leaflet marker icons
const iconDefault = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-step1-4-where',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './step1-4-1-where.html',
  styleUrl: './step1-4-1-where.css'
})
export class Step14Where implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private subscription!: Subscription;
  address: string = '';
  latitude: number = 26.82055; // Default Egypt coordinates if geolocation fails
  longitude: number = 30.8025;
  isGettingLocation = false;
  isLoading = true;
  isMapLoading = false;
  map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private mapChangeSubject = new Subject<{ lat: number, lng: number, zoom: number }>();
  private isMapInitialized = false;

  constructor(
    private formStorage: PropertyFormStorageService,
    private wizardService: ListingWizardService,
    private route: ActivatedRoute,
    private router: Router,
    private validationService: ListingValidationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.mapChangeSubject.pipe(
      debounceTime(1500)
    ).subscribe(({ lat, lng }) => {
      this.handleMapChange(lat, lng);
    });
  }

  ngOnInit(): void {
    // Load saved data
    const savedData = this.formStorage.getStepData('step1-4-1');
    if (savedData?.coordinates) {
      this.address = savedData.address || '';
      this.latitude = savedData.coordinates.lat;
      this.longitude = savedData.coordinates.lng;
    } else {
      // If no saved data, try to get user's location
      this.getUserLocation();
    }

    // Subscribe to next step event
    this.subscription = this.wizardService.nextStep$.subscribe(() => {
      this.saveFormData();
    });
  }

  ngAfterViewInit(): void {
    this.initLeafletMap();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getUserLocation(): void {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
      return;
    }

    this.isGettingLocation = true;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        // If map is already initialized, update it
        if (this.map) {
          this.map.setView([this.latitude, this.longitude], 12);
          this.updateMarker(this.latitude, this.longitude);
        }

        // Get the address for the location
        await this.reverseGeocode(this.latitude, this.longitude);
        
        this.isGettingLocation = false;
        // Save and validate the location data
        this.saveFormData();
        this.validationService.validateStep('step1-4-1-where');
      },
      (error) => {
        console.log('Error getting location:', error);
        this.isGettingLocation = false;
        // Keep default coordinates if geolocation fails
      }
    );
  }

  private saveFormData(): void {
    const data = {
      address: this.address,
      coordinates: {
        lat: this.latitude,
        lng: this.longitude
      }
    };
    this.formStorage.saveFormData('step1-4-1', data);
  }

  private initLeafletMap(): void {
    if (this.mapContainer && this.mapContainer.nativeElement && !this.map) {
      this.map = L.map(this.mapContainer.nativeElement, {
        center: [this.latitude, this.longitude],
        zoom: 12,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(this.map);

      this.addMarker(this.latitude, this.longitude);

      // Add click event to map
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        this.updateLocation(lat, lng);
      });

      this.map.whenReady(() => {
        this.isLoading = false;
        this.isMapInitialized = true;
      });
    }
  }

  private addMarker(lat: number, lng: number): void {
    if (this.map) {
      if (this.marker) {
        this.marker.remove();
      }

      // Create a custom marker icon that matches Airbnb style
      const customIcon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });

      this.marker = L.marker([lat, lng], {
        draggable: true,
        icon: customIcon
      }).addTo(this.map);

      // Handle marker drag events
      this.marker.on('dragend', (event) => {
        const marker = event.target;
        const position = marker.getLatLng();
        this.updateLocation(position.lat, position.lng);
      });
    }
  }

  private updateMarker(lat: number, lng: number): void {
    if (this.marker && this.map) {
      this.marker.setLatLng([lat, lng]);
      this.map.setView([lat, lng], this.map.getZoom());
    } else {
      this.addMarker(lat, lng);
    }
  }

  private updateLocation(lat: number, lng: number): void {
    this.latitude = lat;
    this.longitude = lng;
    this.addMarker(lat, lng);
    this.reverseGeocode(lat, lng);
    // Save and validate when location is updated
    this.saveFormData();
    this.validationService.validateStep('step1-4-1-where');
  }

  private async reverseGeocode(lat: number, lng: number): Promise<void> {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
      const data = await response.json();
      if (data.display_name) {
        // Update address input with formatted address
        this.address = data.display_name;
        
        // Save detailed address components for step1-4-2
        const address = data.address;
        const addressData = {
          country: address.country_code?.toUpperCase() || '',
          countryName: address.country || '',
          street: [address.road, address.house_number].filter(Boolean).join(' ') || '',
          apt: '',
          city: address.city || address.town || address.village || '',
          state: address.state || '',
          zip: address.postcode || '',
          formatted_address: data.display_name
        };
        
        // Save address data for next step
        this.formStorage.saveFormData('step1-4-2', addressData);
        
        // Trigger change detection to update input
        if (this.changeDetectorRef) {
          this.changeDetectorRef.detectChanges();
        }
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      this.address = ''; // Clear address if there's an error
    }
  }

  private handleMapChange(lat: number, lng: number): void {
    if (this.isMapInitialized) {
      this.updateLocation(lat, lng);
    }
  }
}