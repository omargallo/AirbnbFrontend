import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PropertyFormStorageService } from '../../../../core/services/ListingWizard/property-form-storage.service';
import { ListingWizardService } from '../../../../core/services/ListingWizard/listing-wizard.service';
import { debounceTime, Subscription, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

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
  latitude: number = 26.82055;
  longitude: number = 30.8025;

  constructor(
    private formStorage: PropertyFormStorageService,
    private wizardService: ListingWizardService,
    private route: ActivatedRoute,
    private router: Router,
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
    if (savedData) {
      this.address = savedData.address || '';
      this.latitude = savedData.latitude || 26.82055;
      this.longitude = savedData.longitude || 30.8025;
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

  private saveFormData(): void {
    const data = {
      address: this.address,
      latitude: this.latitude,
      longitude: this.longitude
    };
    this.formStorage.saveFormData('step1-4-1', data);
  }

  isLoading = true;
  isMapLoading = false;

  map: L.Map | null = null;
  private mapChangeSubject = new Subject<{ lat: number, lng: number, zoom: number }>();
  private isMapInitialized = false;
  private shouldFitBounds = true;
  private isUserInteraction = false;

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

      this.map.whenReady(() => {
        this.isLoading = false;
        this.isMapInitialized = true;
        this.setupMapEventListeners();
      });
    }
  }

  private setupMapEventListeners() {
    if (!this.map) return;

    const updateMapInfo = () => {
      if (!this.isMapInitialized) return;
      const center = this.map!.getCenter();
      const zoom = this.map!.getZoom();
      this.mapChangeSubject.next({ lat: center.lat, lng: center.lng, zoom });
    };

    this.map.on('movestart', () => {
      if (this.isMapInitialized) {
        this.shouldFitBounds = false;
        this.isMapLoading = true;
      }
    });

    this.map.on('moveend', () => {
      this.isMapLoading = false;
      updateMapInfo();
    });

    this.map.on('zoomstart', () => {
      if (this.isMapInitialized) {
        this.isUserInteraction = true;
        this.shouldFitBounds = false;
        this.isMapLoading = true;
      }
    });

    this.map.on('zoomend', () => {
      this.isMapLoading = false;
      updateMapInfo();
    });
  }

  private async handleMapChange(latitude: number, longitude: number) {
    console.log('🔄 Map changed:', {
      lat: latitude.toFixed(4),
      lng: longitude.toFixed(4),
      distance: 10000
    });
  }
}
