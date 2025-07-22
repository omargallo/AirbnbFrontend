import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService, SearchParams } from '../../core/services/Property/property.service';
import { Property } from '../../core/models/Property';
import * as L from 'leaflet';
import { SliderCard } from '../home/components/slider-card/slider-card';
import { environment } from '../../../environments/environment.development';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-filtered-properties',
  standalone: true,
  imports: [CommonModule, SliderCard],
  templateUrl: './filtered-properties.html',
  styleUrls: ['./filtered-properties.css']
})
export class FilteredProperties implements OnInit {
  properties: Property[] = [];
  selectedProperty: Property | null = null;

  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  pageSize = 10;

  map: L.Map | null = null;
  markers: L.Marker[] = [];
  private searchParams: SearchParams = {} as any;

  // Subject for debouncing map changes
  private mapChangeSubject = new Subject<{ lat: number, lng: number, zoom: number }>();
  private isMapInitialized = false;
  private shouldFitBounds = true;
  private isUserInteraction = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService
  ) {
    // Setup debounced map change handler
    this.mapChangeSubject.pipe(
      debounceTime(1500)
    ).subscribe(({ lat, lng, zoom }) => {
      this.handleMapChange(lat, lng, zoom);
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const searchParams: SearchParams = {};

      if (params['country']) {
        searchParams.country = params['country'];
      }

      const lat = Number(params['latitude']);
      if (!isNaN(lat)) {
        searchParams.latitude = lat;
      }

      const lng = Number(params['longitude']);
      if (!isNaN(lng)) {
        searchParams.longitude = lng;
      }

      const guests = Number(params['guestsCount']);
      if (!isNaN(guests)) {
        searchParams.guestsCount = guests;
      }

      if (params['startDate']) {
        searchParams.startDate = params['startDate'];
      }

      if (params['endDate']) {
        searchParams.endDate = params['endDate'];
      }

      const page = Number(params['page']);
      searchParams.page = !isNaN(page) ? page : 1;

      const pageSize = Number(params['pageSize']);
      searchParams.pageSize = !isNaN(pageSize) ? pageSize : 10;

      const zoom = Number(params['zoom']);
      if (!isNaN(zoom)) {
        // searchParams.maxDistanceKm = this.calculateDistanceFromZoom(zoom);
        searchParams.maxDistanceKm = 10000000;
      } else {
        searchParams.maxDistanceKm = 10000000;
      }

      this.searchParams = searchParams;
      this.currentPage = searchParams.page!;
      this.pageSize = searchParams.pageSize!;

      this.shouldFitBounds = !this.isMapInitialized;
      this.loadProperties();
    });
  }

  loadProperties() {
    this.propertyService.searchProperties(this.searchParams).subscribe({
      next: response => {
        console.log('🔍 Search Response:', response);
        console.log('📍 Search Params:', this.searchParams);

        if (response.isSuccess) {
          // this.properties = response.data.items;

          //test 
          const originalItems = response.data.items;
          this.properties = [
            ...originalItems,
            ...originalItems,
            ...originalItems
          ];


          this.totalItems = 100;
          this.totalPages = 10;
          this.currentPage = 1;
          this.pageSize = 9;
          // this.totalItems = response.data.metaData.total;
          // this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          // this.currentPage = response.data.metaData.page;
          // this.pageSize = response.data.metaData.pageSize;

          if (!this.map) {
            this.initializeLeafletMap();
          }
          //  else {
          //   this.updateMapMarkers();
          // }
        }
      },
      error: err => console.error('❌ API Error:', err)
    });
  }

  trackByPropertyId(_i: number, p: Property) {
    return p.id;
  }

  selectProperty(property: Property) {
    this.selectedProperty = property;
    if (this.map) {
      this.map.setView([property.latitude, property.longitude], 14);
    }
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.searchParams.page = page;
    this.updateUrlParams();
    this.loadProperties();
    document.querySelector('.properties-panel')?.scrollTo(0, 0);
  }

  getVisiblePages(): (number | string)[] {
    const delta = 2;
    const range: (number | string)[] = [];
    const pages: (number | string)[] = [];

    for (let i = Math.max(2, this.currentPage - delta);
      i <= Math.min(this.totalPages - 1, this.currentPage + delta); i++) {
      range.push(i);
    }

    if (this.currentPage - delta > 2) pages.push(1, '...');
    else pages.push(1);

    pages.push(...range);

    if (this.currentPage + delta < this.totalPages - 1) pages.push('...', this.totalPages);
    else if (this.totalPages > 1) pages.push(this.totalPages);

    return pages.filter((v, i, a) => i === 0 || v !== a[i - 1]);
  }

  private createCustomMarkerIcon(price: number): L.DivIcon {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: var(--bg-color) !important;
          color: var(--primary-text-color);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-align: center;
          border: 2px solid var(--bg-color) !important;
          position: relative;
        ">
          ${price}
          <div style="
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid var(--bg-color);
          "></div>
        </div>
      `,
      iconSize: [60, 30],
      iconAnchor: [30, 40]
    });
  }

  private initializeLeafletMap() {
    const lat = this.searchParams.latitude || 25.7617;
    const lng = this.searchParams.longitude || -80.1918;

    this.map = L.map('leaflet-map').setView([lat, lng], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map!);

    // Add event listeners for map changes
    this.setupMapEventListeners();
    // this.updateMapMarkers();

    this.properties.forEach(p => {
      const customIcon = this.createCustomMarkerIcon(p.pricePerNight);

      const marker = L.marker([p.latitude, p.longitude], { icon: customIcon })
        .addTo(this.map!)
        .bindPopup(`
          <div class="card border-0 rounded rounded-2 popup-card" style="width: 200px; cursor: pointer; background-color: var(--bg-color);" onclick="this.selectProperty(${p.id})">
            <div class="image-container position-relative">
              <img src="${this.getPropertyImage(p)}"
                   alt="listing image"
                   class="img-fluid rounded-4"
                   style="width: 100%; height: 120px; object-fit: cover;">
              ${false ? `
              <div class="favorite badge fw-semibold position-absolute top-0 start-0 m-2"
                   style="font-size: 10px; padding: 2px 6px; border-radius: 999px; color: var(--primary-text-color) !important; background-color: var(--bg-color);">
                Guest favorite
              </div>` : ''}
              <button class="heart position-absolute top-0 end-0 m-2"
                      style="background: none; border: none; cursor: pointer;">
                <i class="bi bi-heart fs-6"></i>
              </button>
            </div>

            <div class="info px-2 pt-2 pb-3">
              <div class="title fw-semibold" style="font-size: 12px; color: var(--primary-text-color); !important">${p.title}</div>
              <div class="subtitle small" style="font-size: 10px; color: var(--secondary-text-color) !important;">${this.getLocationSubtitle(p)}</div>

              <div class="d-flex justify-content-between align-items-center mt-1 flex-row-reverse">
                <div class="rating small d-flex align-items-center" style="font-size: 10px; color: var(--secondary-text-color) !important;">
                  <i class="bi bi-star-fill text-warning me-1"></i>${p.averageRating}
                </div>
                <div class="price" style="font-size: 10px; color: var(--secondary-text-color) !important;">
                  $${p.pricePerNight} <span class="small">for 5 night</span>
                </div>
              </div>
            </div>
          </div>
        `)
        .on('click', () => this.selectProperty(p));
      this.markers.push(marker);
    });

    // Only fit bounds if it's initial load or specifically requested
    if (this.markers.length && this.shouldFitBounds && !this.isUserInteraction) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }

    // Mark map as initialized after a short delay
    setTimeout(() => {
      this.isMapInitialized = true;
      this.isUserInteraction = false;
      console.log('🗺️ Map initialized and ready for change detection');
    }, 2000);
  }

  private updateMapMarkers() {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    this.properties.forEach(p => {
      const customIcon = this.createCustomMarkerIcon(p.pricePerNight);
      const marker = L.marker([p.latitude, p.longitude], { icon: customIcon })
        .addTo(this.map!)
        .on('click', () => this.selectProperty(p));

      this.markers.push(marker);
    });

    if (this.markers.length && this.shouldFitBounds && !this.isUserInteraction) {
      const group = L.featureGroup(this.markers);
      this.map!.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }

  private setupMapEventListeners() {
    if (!this.map) return;

    const updateMapInfo = () => {
      if (!this.isMapInitialized) return;

      const center = this.map!.getCenter();
      const zoom = this.map!.getZoom();

      this.mapChangeSubject.next({
        lat: center.lat,
        lng: center.lng,
        zoom: zoom
      });
    };

    this.map.on('movestart', () => {
      if (this.isMapInitialized) {
        this.isUserInteraction = true;
        this.shouldFitBounds = false;
      }
    });

    this.map.on('moveend', updateMapInfo);

    this.map.on('zoomstart', () => {
      if (this.isMapInitialized) {
        this.isUserInteraction = true;
        this.shouldFitBounds = false;
      }
    });

    this.map.on('zoomend', updateMapInfo);
  }

  private async handleMapChange(lat: number, lng: number, zoom: number) {
    console.log('🔄 Map changed:', {
      lat: lat.toFixed(4),
      lng: lng.toFixed(4),
      zoom,
      // distance: this.calculateDistanceFromZoom(zoom)
      distance: 1000000000
    });

    // Update search parameters with new location and distance
    this.searchParams.latitude = lat;
    this.searchParams.longitude = lng;
    // this.searchParams.maxDistanceKm = this.calculateDistanceFromZoom(zoom);
    this.searchParams.maxDistanceKm = 1000000000;
    this.searchParams.page = 1; // Reset to first page when location changes
    this.currentPage = 1;

    // Get country from coordinates using reverse geocoding
    try {
      const country = await this.getCountryFromCoordinates(lat, lng);
      if (country) {
        this.searchParams.country = country;
        console.log('🌍 Country detected:', country);
      }
    } catch (error) {
      console.warn('⚠️ Failed to get country from coordinates:', error);
      // Keep existing country or remove it if coordinates changed significantly
    }

    // Update URL parameters
    this.updateUrlParams(zoom);

    // Load new properties
    this.loadProperties();
  }

  private async getCountryFromCoordinates(lat: number, lng: number): Promise<string | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=3&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();

      const country =
        data?.name ||
        data.address?.country ||
        data.display_name?.split(',').pop()?.trim() || data?.address?.country_code;

      return country || null;
    } catch (error) {
      console.error('❌ Error in reverse geocoding:', error);
      return null;
    }
  }

  private calculateDistanceFromZoom(zoom: number): number {

    if (zoom >= 16) return 1;
    if (zoom >= 14) return 3;
    if (zoom >= 12) return 8;
    if (zoom >= 10) return 20;
    if (zoom >= 8) return 50;
    if (zoom >= 6) return 100;
    if (zoom >= 4) return 300;
    return 500;
  }

  private updateUrlParams(zoom?: number) {
    const queryParams: any = {
      ...this.route.snapshot.queryParams,
      latitude: this.searchParams.latitude?.toFixed(6),
      longitude: this.searchParams.longitude?.toFixed(6),
      page: this.searchParams.page,
      pageSize: this.searchParams.pageSize,
      maxDistanceKm: this.searchParams.maxDistanceKm
    };

    if (this.searchParams.country) {
      queryParams.country = this.searchParams.country;
    }

    if (zoom !== undefined) {
      queryParams.zoom = zoom;
    }

    if (this.searchParams.guestsCount) {
      queryParams.guestsCount = this.searchParams.guestsCount;
    }

    if (this.searchParams.startDate) {
      queryParams.startDate = this.searchParams.startDate;
    }

    if (this.searchParams.endDate) {
      queryParams.endDate = this.searchParams.endDate;
    }

    console.log('🔗 Updating URL params:', queryParams);

    // Navigate with new parameters without refreshing the page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: true
    });
  }

  getPropertyImage(property: Property): string {
    return property.images?.[0]?.imageUrl
      ? `${environment.base}${property.images[0].imageUrl}`
      : 'assets/images/placeholder.jpg';
  }

  getLocationSubtitle(property: Property): string {
    return `${property.city}, ${property.state}`;
  }
}
