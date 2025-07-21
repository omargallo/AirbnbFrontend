import { Component, input, Input, OnInit } from '@angular/core';
import { PropertyImageService } from '../../../core/services/PropertyImage/property-image.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-propertImage-galary',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './propertImage-galary.component.html',
  styleUrls: ['./propertImage-galary.component.css']
})
export class PropertImageGalaryComponent implements OnInit {


      images: any[] = [];
      isLoading: boolean = true;
      error: string | null = null;
      activeImageIndex: number = 0;
      @Input() propertyId: number = 1; // Default property ID, can be set from outside

  constructor(private propertyImageService: PropertyImageService) { }

  ngOnInit() {
    console.log('come inside property image galary');
    this.loadPropertyImages();
  }

loadPropertyImages() {
    const propertyId = this.propertyId;

    if (!propertyId) {
      this.error = 'Property ID is required';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.propertyImageService.getAllImagesByPropertyId(propertyId).subscribe({
      next: (images) => {
        this.images = images;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load images. Please try again later.';
        this.isLoading = false;
        console.error('Error loading images:', err);
      }
    });
}



getFullImageUrl(url: string): string {
  return `https://localhost:7025${url}`; // or use environment.baseUrl
}
      setActiveImage(index: number) {
        this.activeImageIndex = index;
      }
      nextImage() {
        this.activeImageIndex = (this.activeImageIndex + 1) % this.images.length;
      }
      prevImage() {
        this.activeImageIndex = (this.activeImageIndex - 1 + this.images.length) % this.images.length;
      }
}