import { Property } from './../../core/models/Property';
import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../core/services/Property/property.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Routes } from '@angular/router';
import { PropertImageGalaryComponent } from "../PropertyDetails/propertImage-galary/propertImage-galary.component";

@Component({
  selector: 'app-property-info',
  imports: [CommonModule, PropertImageGalaryComponent],
  templateUrl: './property-info.html',
  styleUrl: './property-info.css'
})
export class PropertyInfo implements OnInit {
  // properties: Property[] = [];
  selectedProperty: Property | null = null;
  isLoading = true;
  error: string | null = null;

  // State for child components
  activeTab: 'gallery' | 'reviews' | 'amenities' = 'gallery';
  propertyId: number =0; // Should come from out
  property: any;

  constructor(private propertyService: PropertyService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.propertyId = +params['propertyId']; // Get propertyId from route params
      if(this.propertyId <= 0) {
        this.error = 'Invalid property ID';
        this.isLoading = false;
        return;
      }
      console.log('Property ID from route:', this.propertyId);
      this.showPropertyDetails(this.propertyId);
    });
  }



  showPropertyDetails(id: number): void {
    this.propertyService.getPropertyById(id).subscribe({
      next: (property) => {
        this.selectedProperty = property;
        console.log('Selected property:', this.selectedProperty);
        console.log(id);

      },
      error: (err) => {
        this.error = 'Failed to load property details';
        console.error(err);
      }
    });
  }


   changeTab(tab: 'gallery' | 'reviews' | 'amenities'): void {
    this.activeTab = tab;
  }

}