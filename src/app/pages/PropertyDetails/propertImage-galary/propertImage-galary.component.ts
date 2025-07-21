import { Url } from './../../../../../node_modules/lightningcss/node/ast.d';
import { ChangeDetectorRef, Component, input, Input, OnInit } from '@angular/core';
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
  @Input() propertyId!: number ; // Default property ID, can be set from outside

      images: string[] = [];
      isLoading: boolean = true;
      error: string | null = null;
      activeImageIndex: number = 0;
      img: any;

  constructor(private propertyImageService: PropertyImageService ,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (!this.propertyId) {
      this.error = 'Property ID is required';
      this.isLoading = false;
      return;
    }

    this.loadPropertyImages();
  }

  private loadPropertyImages(): void {
    this.isLoading = true;
    this.error = null;

    this.propertyImageService
                .getAllImagesByPropertyId(this.propertyId)
                .subscribe({
                      next: (response) => {
                        console.log('API response:', response);
                        this.images = response.data.map((img: any) =>
                          this.getFullImageUrl(img.imageUrl)
                        );
                        this.isLoading = false;
                        this.cdr.detectChanges();
                      },
                      error: (err) => {
                        this.error = 'Failed to load images. Please try again later.';
                        this.isLoading = false;
                        console.error(err);
                        this.cdr.detectChanges();
                      }
                    });
  }

  private getFullImageUrl(url: string): string {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://localhost:7025${url}`;
  }

  // getFullImageUrl(url: string): string {
  //   return `https://localhost:7025${url}`;

  // }

}