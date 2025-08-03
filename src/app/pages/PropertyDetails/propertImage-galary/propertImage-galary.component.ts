import { authGuard } from './../../../core/guards/auth.guard';
import { Property } from './../../../../../node_modules/acorn/dist/acorn.d';
import { PropertyService } from './../../../core/services/Property/property.service';
import { Url } from './../../../../../node_modules/lightningcss/node/ast.d';
import {
  ChangeDetectorRef,
  Component,
  input,
  Input,
  OnInit,
} from '@angular/core';
import { PropertyImageService } from '../../../core/services/PropertyImage/property-image.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { DialogService } from '../../../core/services/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-propertImage-galary',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './propertImage-galary.component.html',
  styleUrls: ['./propertImage-galary.component.css'],
})
export class PropertImageGalaryComponent implements OnInit {
  @Input() propertyId!: number; // Default property ID, can be set from outside

  images: string[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  activeImageIndex: number = 0;
  img: any;
  Property: any;

  constructor(
    private propertyImageService: PropertyImageService,
    private cdr: ChangeDetectorRef,
    private PropertyService: PropertyService,
    private authService: AuthService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) {}

  private showToast(
    message: string,
    vertical: 'top' | 'bottom',
    horizontal: 'left' | 'right'
  ) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: horizontal,
      verticalPosition: vertical,
      panelClass: ['custom-snackbar'],
    });
  }
  ngOnInit(): void {
    if (!this.propertyId) {
      this.error = 'Property ID is required';
      this.isLoading = false;
      return;
    }
    this.PropertyService.getPropertyById(this.propertyId).subscribe({
      next: (response) => {
        this.Property = response;
      },
    });

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
        },
      });
  }

  private getFullImageUrl(url: string): string {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://localhost:7025${url}`;
  }

  onShare() {
    this.showToast('Share clicked!', 'bottom', 'left'); // replace with modal or copy link logic
  }


onSave() {
  if (this.authService.accessToken !== null) {
    // Proceed to save
    console.log('Saved!');
  } else {
    
    this.dialogService.openDialog('login');
  }
  
}}