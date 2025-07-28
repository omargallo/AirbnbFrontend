import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { Property } from '../../models/Property';
import { PropertyImage } from '../../models/PropertyImage';
import { PropertyFormStorageService } from '../ListingWizard/property-form-storage.service';
import { PropertyDisplayDTO } from '../../models/PropertyDisplayDTO';
import { AuthService } from '../auth.service';
import { UserService } from '../User/user.service';

interface ApiResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: T;
}

interface ImageUploadResponse {
  imageUrls: string[];
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyCreationService {
  private readonly baseUrl = `${environment.base}/api/Property`;

  constructor(
    private http: HttpClient,
    private formStorage: PropertyFormStorageService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  createProperty(property: Omit<Property, 'id' | 'isFavourite'>): Observable<PropertyDisplayDTO> {
    return this.ensureHostRole().pipe(
      switchMap(() => {
        const propertyWithHostId = {
          ...property,
          hostId: this.authService.userId || ''
        };

        return this.http.post<ApiResponse<PropertyDisplayDTO>>(this.baseUrl, propertyWithHostId).pipe(
          map(response => {
            if (response.isSuccess) {
              this.formStorage.clearFormData();
              return response.data;
            }
            throw new Error(response.message);
          }),
          catchError(error => {
            console.error('Property creation failed:', error);
            return throwError(() => new Error('Failed to create property'));
          })
        );
      })
    );
  }

  uploadPropertyImages(propertyId: number, files: File[]): Observable<any> {
    if (!files || files.length === 0) {
      return throwError(() => new Error('No files provided for upload'));
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file, file.name);
    });
    formData.append('propertyId', propertyId.toString());
    formData.append('hostId', this.authService.userId || '');

    return this.http.post<ImageUploadResponse>(`${this.baseUrl}/upload-images`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(error => {
        console.error('Image upload failed:', error);
        return throwError(() => new Error('Failed to upload images'));
      })
    );
  }

  savePhotosToProperty(propertyId: number, imageUrls: string[]): Observable<any> {
    if (!imageUrls || imageUrls.length === 0) {
      return throwError(() => new Error('No image URLs provided'));
    }

    return this.http.post(`${this.baseUrl}/${propertyId}/save-images`, {
      images: imageUrls.map((url, index) => ({
        imageUrl: url,
        isCover: index === 0, // First image is cover
        groupName: 'property_images'
      }))
    }).pipe(
      catchError(error => {
        console.error('Failed to save photos:', error);
        return throwError(() => new Error('Failed to save photos to property'));
      })
    );
  }

  buildPropertyFromWizard(): Omit<PropertyDisplayDTO, 'id'> {
    const formData = this.formStorage.getFormData();
    
    const property: Omit<PropertyDisplayDTO, 'id'> = {
      title: formData['step2-4']?.title || '',
      description: formData['step2-6']?.description || '',
      city: formData['step1-4-2']?.city || '',
      country: formData['step1-4-2']?.country || '',
      state: formData['step1-4-2']?.state || '',
      latitude: parseFloat(formData['step1-4-1']?.coordinates?.lat) || 0,
      longitude: parseFloat(formData['step1-4-1']?.coordinates?.lng) || 0,
      pricePerNight: formData['step3-4-1']?.price || 0,
      maxGuests: formData['step1-5']?.guests || 0,
      bedrooms: formData['step1-5']?.bedrooms || 0,
      beds: formData['step1-5']?.beds || 0,
      bathrooms: formData['step1-5']?.bathrooms || 0,
      propertyTypeId: formData['step1-2']?.propertyTypeId || 1,
      images: formData['step2-3']?.images?.map((image: { url: string; isCover: boolean }) => ({
        groupName: 'property_images',
        imageUrl: image.url,
        isCover: image.isCover || false,
        isDeleted: false
      })) || [],
      averageRating: 0,
      reviewCount: 0,
      isActive: true,
      isDeleted: false,
      hostId: this.authService.userId || ''
    };

    return property;
  }

  private ensureHostRole(): Observable<void> {
    const userId = this.authService.userId;
    if (!userId) {
      return throwError(() => new Error('User not logged in'));
    }

    const currentRoles = this.authService.role;
    if (currentRoles.includes('host')) {
      return of(void 0);
    }

    return this.userService.updateToHostRole(userId).pipe(
      map(() => void 0),
      catchError(error => {
        console.error('Failed to update to host role:', error);
        return throwError(() => new Error('Failed to update user role'));
      })
    );
  }

  validateImages(images: string[], minCount: number = 5): boolean {
    return images && images.length >= minCount;
  }
}