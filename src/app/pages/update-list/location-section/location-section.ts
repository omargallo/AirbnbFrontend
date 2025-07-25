import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import * as L from 'leaflet';

export interface LocationSectionData {
  location: {
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

@Component({
  selector: 'app-location-section',
  standalone: true,
  styleUrls: ['../update-list.css', './location-section.css'],
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './location-section.html',
})
export class LocationSectionComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() data: LocationSectionData | null = null;
  @Output() dataChange = new EventEmitter<LocationSectionData>();
  @Output() hasChanges = new EventEmitter<boolean>();
  @Output() validationChange = new EventEmitter<boolean>();

  locationForm!: FormGroup;
  private destroy$ = new Subject<void>();
  private initialValue: any = {};
  showCoordinates: boolean = false;
  private map: any;
  private marker: any;
  private geocoder: any;

 
  private propertyLocationIcon = L.icon({
    iconUrl: 'https://www.svgrepo.com/show/127575/location-sign.svg', 
    

    iconSize: [25, 41], 
    iconAnchor: [12, 41], 
    popupAnchor: [1, -34], 
    
  });

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setupFormData();
    this.setupFormChangeTracking();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeForm(): void {
    this.locationForm = this.fb.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      latitude: [null],
      longitude: [null]
    });
  }

  private initMap(): void {
    let defaultLat = 51.505;
    let defaultLng = -0.09;
    let zoom = 2;

    if (this.data?.location?.coordinates) {
      defaultLat = this.data.location.coordinates.lat;
      defaultLng = this.data.location.coordinates.lng;
      zoom = 13;
      this.showCoordinates = true;
    }

    this.map = L.map('map').setView([defaultLat, defaultLng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    if (this.data?.location?.coordinates) {
      this.addMarker(this.data.location.coordinates.lat, this.data.location.coordinates.lng);
    }

    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      this.addMarker(lat, lng);
      this.updateFormCoordinates(lat, lng);
    });
  }

  private addMarker(lat: number, lng: number): void {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.marker([lat, lng], {
      draggable: true,
      icon: this.propertyLocationIcon 
    }).addTo(this.map)
      .bindPopup('Your property location')
      .openPopup();

    this.marker.on('dragend', (event: any) => {
      const marker = event.target;
      const position = marker.getLatLng();
      this.updateFormCoordinates(position.lat, position.lng);
    });
  }

  private updateFormCoordinates(lat: number, lng: number): void {
    this.locationForm.patchValue({
      latitude: lat,
      longitude: lng
    });
    this.showCoordinates = true;
  }

  private setupFormData(): void {
    if (this.data) {
      this.initialValue = {
        address: this.data.location.address,
        city: this.data.location.city,
        country: this.data.location.country,
        latitude: this.data.location.coordinates?.lat || null,
        longitude: this.data.location.coordinates?.lng || null
      };
      this.locationForm.patchValue(this.initialValue);
    }
  }

  private setupFormChangeTracking(): void {
    this.locationForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        const hasChanges = JSON.stringify(value) !== JSON.stringify(this.initialValue);
        const isValid = this.locationForm.valid;
        this.hasChanges.emit(hasChanges);
        this.validationChange.emit(isValid);
        if (hasChanges) {
          const locationData: LocationSectionData = {
            location: {
              address: value.address || '',
              city: value.city || '',
              country: value.country || '',
              coordinates: (value.latitude && value.longitude) ? {
                lat: Number(value.latitude),
                lng: Number(value.longitude)
              } : undefined
            }
          };
          this.dataChange.emit(locationData);
        }
      });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.locationForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.locationForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    return '';
  }

  toggleCoordinates(): void {
    this.showCoordinates = !this.showCoordinates;
    if (!this.showCoordinates) {
      this.locationForm.patchValue({
        latitude: null,
        longitude: null
      });
      if (this.marker) {
        this.map.removeLayer(this.marker);
        this.marker = null;
      }
    } else if (this.locationForm.value.latitude && this.locationForm.value.longitude) {
      this.addMarker(
        this.locationForm.value.latitude,
        this.locationForm.value.longitude
      );
    }
  }

  // Method to get current location
  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.map.setView([lat, lng], 13);
          this.addMarker(lat, lng);
          this.updateFormCoordinates(lat, lng);
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('Unable to retrieve your location. Please check your browser settings.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }

  updateInitialValue(): void {
    this.initialValue = { ...this.locationForm.value };
    this.hasChanges.emit(false);
  }

  getCurrentData(): LocationSectionData {
    const formValue = this.locationForm.value;
    return {
      location: {
        address: formValue.address || '',
        city: formValue.city || '',
        country: formValue.country || '',
        coordinates: (formValue.latitude && formValue.longitude) ? {
          lat: Number(formValue.latitude),
          lng: Number(formValue.longitude)
        } : undefined
      }
    };
  }

  isValid(): boolean {
    return this.locationForm.valid;
  }

  getFullAddress(): string {
    const formValue = this.locationForm.value;
    const parts = [formValue.address, formValue.city, formValue.country].filter(Boolean);
    return parts.join(', ');
  }

  hasValidCoordinates(): boolean {
    const lat = this.locationForm.get('latitude')?.value;
    const lng = this.locationForm.get('longitude')?.value;
    if (!lat || !lng) return false;
    const latitude = Number(lat);
    const longitude = Number(lng);
    return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  }

  clearCoordinates(): void {
    this.locationForm.patchValue({
      latitude: null,
      longitude: null
    });
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
  }
}
