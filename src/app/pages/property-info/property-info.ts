import { Property } from './../../core/models/Property';
import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../core/services/Property/property.service';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { PropertImageGalaryComponent } from "../PropertyDetails/propertImage-galary/propertImage-galary.component";

@Component({
  selector: 'app-property-info',
  imports: [CommonModule, PropertImageGalaryComponent],
  templateUrl: './property-info.html',
  styleUrl: './property-info.css'
})
export class PropertyInfo implements OnInit {
  // properties: Property[] = [];
  propertyid=1;
  selectedProperty: Property | null = null;
  isLoading = true;
  error: string | null = null;

  // State for child components
  activeTab: 'gallery' | 'reviews' | 'amenities' = 'gallery';
  propertyId: number = 1; // Should come from out
  property: any;

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.showPropertyDetails(1);
  }

  // onChange(event: any): void {
  //   console.log('Change event:', event);
  // }



  showPropertyDetails(id: number): void {
    this.propertyService.getPropertyById(1).subscribe({
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