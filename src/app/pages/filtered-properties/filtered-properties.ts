import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService, SearchParams } from '../../core/services/Property/property.service';
import { Property } from '../../core/models/Property';

@Component({
  selector: 'app-filtered-properties',
  standalone: true,
  imports: [],
  templateUrl: './filtered-properties.html',
  styleUrl: './filtered-properties.css',
})
export class FilteredProperties implements OnInit {
  properties: Property[] = [];

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log('📥 Received query params:', params);

      const searchParams: SearchParams = {
        country: params['country'],
        latitude: Number(params['latitude']),
        longitude: Number(params['longitude']),
        guestsCount: Number(params['guestsCount']),
        startDate: params['startDate'],
        endDate: params['endDate'],
        page: params['page'] ? Number(params['page']) : 1,
        pageSize: params['pageSize'] ? Number(params['pageSize']) : 10,
        maxDistanceKm: params['maxDistanceKm'] ? Number(params['maxDistanceKm']) : 100000,
      };

      this.propertyService.searchProperties(searchParams).subscribe({
        next: (response) => {
          console.log('📦 API Response:', response);
          if (response.isSuccess) {
            this.properties = response.data.items;
            console.log('✅ Filtered Properties:', this.properties);
          } else {
            console.warn('⚠️ Search failed:', response.message);
          }
        },
        error: (err) => {
          console.error('❌ API Error:', err);
        },
      });
    });
  }
}
