import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PropertyService, SearchParams } from '../../core/services/Property/property.service';
import { Property } from '../../core/models/Property';
import * as L from 'leaflet';
import { SliderCard } from '../home/components/slider-card/slider-card';
import { environment } from '../../../environments/environment.development';


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

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService
  ) { }

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

      searchParams.maxDistanceKm = 100000;

      this.searchParams = searchParams;
      this.currentPage = searchParams.page!;
      this.pageSize = searchParams.pageSize!;
      this.loadProperties();
    });
  }

  loadProperties() {
    this.propertyService.searchProperties(this.searchParams).subscribe({
      next: response => {
        if (response.isSuccess) {
          this.properties = response.data.items;
          this.totalItems = response.data.metaData.total;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);

          // لو عايز totalPages مباشرة:
          // this.totalPages = response.data.metaData.totalPages;

          this.currentPage = response.data.metaData.page;
          this.pageSize = response.data.metaData.pageSize;

          this.initializeLeafletMap();
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

  private initializeLeafletMap() {
    const lat = this.searchParams.latitude || 30.0444;
    const lng = this.searchParams.longitude || 31.2357;

    if (this.map) {
      this.map.remove();
      this.map = null;
      this.markers = [];
    }

    this.map = L.map('leaflet-map').setView([lat, lng], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map!);

    this.properties.forEach(p => {
      const marker = L.marker([p.latitude, p.longitude])
        .addTo(this.map!)
        .bindPopup(`
          <div style="min-width:150px">
            <strong>${p.title}</strong><br>
            ${p.pricePerNight} $/ night<br>
            ${p.city}, ${p.state}
          </div>
        `)
        .on('click', () => this.selectProperty(p));
      this.markers.push(marker);
    });

    if (this.markers.length) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }


  getPropertyImage(property: Property): string {
    return property.images?.[0]?.imageUrl
      ? `${environment.base}/uploads/${property.images[0].imageUrl}`
      : 'assets/images/placeholder.jpg';
  }


  getLocationSubtitle(property: Property): string {
    return `${property.city}, ${property.state}`;
  }
}
