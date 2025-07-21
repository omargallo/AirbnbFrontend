import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step1-3-what-type',
  imports: [CommonModule, FooterComponent],
  templateUrl: './step1-3-what-type.html',
  styleUrl: './step1-3-what-type.css'
})
export class Step13WhatType {
  // List of available property types
  propertyTypes: string[] = [
    'Apartment',
    'House',
    'Villa',
    'Cottage',
    'Studio',
    'Loft',
    'Other'
  ];

  // Currently selected property type
  selectedType: string | null = null;

  // Method to select a property type
  selectType(type: string): void {
    this.selectedType = type;
  }

  // List of place options for UI selection
  placeOptions = [
    {
      key: 'entire',
      title: 'An entire place',
      description: 'Guests have the whole place to themselves.'
    },
    {
      key: 'room',
      title: 'A room',
      description: 'Guests have their own room in a home, plus access to shared spaces.'
    },
    {
      key: 'shared',
      title: 'A shared room',
      description: 'Guests sleep in a room or common area that may be shared with others.'
    }
  ];

  // Currently selected place type for UI
  selectedPlace: string = 'entire';

  // Method to select a place type (for UI radio group)
  selectPlace(key: string): void {
    this.selectedPlace = key;
  }
}
