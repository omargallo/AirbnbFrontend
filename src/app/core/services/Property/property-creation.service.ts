import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { Property } from '../../models/Property';
import { PropertyDisplayDTO } from '../../models/PropertyDisplayDTO';
import { AuthService } from '../auth.service';
import { UserService } from '../User/user.service';
import { PropertyFormStorageService } from '../../../pages/add-property/services/property-form-storage.service';
import { AmenityService } from '../Amenity/amenity.service';
import { Router } from '@angular/router';

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
    private userService: UserService,
    private amenityService: AmenityService,
    private router: Router
  ) { }

  createProperty(property: Omit<Property, 'id' | 'isFavourite'>): Observable<PropertyDisplayDTO> {
    return this.ensureHostRole().pipe(
      switchMap(() => {
        const hostId = this.authService.userId || '';
        const propertyWithHostId = { ...property, hostId };

        return this.http.post<ApiResponse<PropertyDisplayDTO>>(this.baseUrl, propertyWithHostId).pipe(
          switchMap(response => {
            if (!response.isSuccess) {
              throw new Error(response.message);
            }

            const createdProperty = response.data;

            const allFormData = this.formStorage.getFormData();
            console.log('=== ALL FORM DATA ===');
            console.log(allFormData);

            const stepData = allFormData['step2-3'];
            console.log('=== STEP 2-3 DATA ===');
            console.log(stepData);

            if (!stepData) {
              console.warn('No step2-3 data found in form storage');
              return of(createdProperty);
            }

            // const imageFiles: File[] = stepData.imageFiles || [];
            const imageFiles: File[] = this.formStorage.getImageFiles();

            const coverIndex: number = stepData.coverIndex || 0;

            console.log('Image files found:', imageFiles.length);
            console.log('Cover index:', coverIndex);

            imageFiles.forEach((file, index) => {
              console.log(`File ${index}:`, {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
              });
            });

            if (!imageFiles.length) {
              console.warn('No image files found for upload');
              return of(createdProperty);
            }

            console.log(`Proceeding to upload ${imageFiles.length} images...`);

            return this.uploadPropertyImages(createdProperty.id, hostId, imageFiles, 'property_images', coverIndex).pipe(
              switchMap((uploadResponse) => {
                console.log('Upload response:', uploadResponse);
                if (uploadResponse.success) {
                  console.log('Images uploaded successfully!');
                } else {
                  console.error('Upload failed:', uploadResponse.message);
                }
                
                // Get selected amenities from step2-2
                const step2_2Data = allFormData['step2-2'];
                console.log("Step2-2Data",step2_2Data)
                const selectedAmenityIds = step2_2Data?.selectedAmenityIds || [];
                
                if (selectedAmenityIds.length > 0) {
                  console.log("Uploading Selected Amenities ",selectedAmenityIds.length)
                   this.amenityService.assignAmenitiesToProperty(createdProperty.id, selectedAmenityIds).pipe(
                        map(() => {
                          console.log('Amenities assigned successfully!');
                          this.formStorage.clearFormData();
                          this.router.navigateByUrl("/host")
                          return createdProperty;
                        }),
                        catchError(amenityError => {
                          console.error('Failed to assign amenities:', amenityError);
                          // Still return the created property even if amenity assignment fails
                          this.formStorage.clearFormData();
                          this.router.navigateByUrl("/host")
                          return of(createdProperty);
                        })
                      ).subscribe()
                  return of(createdProperty)
                      
                }else{
                  console.log("no selected Amenities")
                  
                }
                  
                this.formStorage.clearFormData();
                this.router.navigateByUrl("/host")
                return of(createdProperty);
              }),
              catchError(uploadError => {
                console.error('Image upload failed:', uploadError);
                return throwError(() => new Error('Failed to upload images: ' + uploadError.message));
              })
            );
          }),
          catchError(error => {
            console.error('Property creation failed:', error);
            return throwError(() => new Error('Failed to create property: ' + error.message));
          })
        );
      })
    );
  }

  uploadPropertyImages(
    propertyId: number,
    hostId: string,
    files: File[],
    groupName: string = 'property_images',
    coverIndex: number = 0
  ): Observable<ImageUploadResponse> {
    console.log('=== STARTING IMAGE UPLOAD ===');
    console.log('Property ID:', propertyId);
    console.log('Host ID:', hostId);
    console.log('Group Name:', groupName);
    console.log('Cover Index:', coverIndex);
    console.log('Files count:', files.length);

    const formData = new FormData();
    formData.append('PropertyId', propertyId.toString());
    formData.append('HostId', hostId);
    formData.append('GroupName', groupName);
    formData.append('CoverIndex', coverIndex.toString());

    files.forEach((file, index) => {
      console.log(`Adding file ${index + 1}/${files.length}:`, {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type
      });
      if (!(file instanceof File)) {
        console.error(`❌ File at index ${index} is not a real File object:`, file);
        return;
      }

      formData.append('Files', file, file.name);
    });



    const uploadUrl = `${this.baseUrl}/property-images/upload`;
    console.log('Upload URL:', uploadUrl);

    // Debug FormData contents
    console.log('=== FORM DATA CONTENTS ===');
    for (let pair of (formData as any).entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    return this.http.post<ImageUploadResponse>(uploadUrl, formData).pipe(
      tap(response => {
        console.log('=== UPLOAD RESPONSE ===');
        console.log('Success:', response.success);
        console.log('Message:', response.message);
        console.log('Image URLs:', response.imageUrls);
      }),
      catchError(error => {
        console.error('=== UPLOAD ERROR ===');
        console.error('Status:', error.status);
        console.error('Status Text:', error.statusText);
        console.error('Error Body:', error.error);
        console.error('Full Error:', error);

        let errorMessage = 'Unknown error occurred';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (typeof error.error === 'string') {
          errorMessage = error.error;
        }

        return throwError(() => new Error(`Image upload failed: ${errorMessage}`));
      })
    );
  }

  buildPropertyFromWizard(): Omit<PropertyDisplayDTO, 'id'> {
    const formData = this.formStorage.getFormData();

    console.log('=== BUILDING PROPERTY FROM WIZARD ===');
    console.log('All form data:', formData);

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
      images: [],
      averageRating: 0,
      reviewCount: 0,
      isActive: true,
      isDeleted: false,
      hostId: this.authService.userId || ''
    };

    console.log('Built property:', property);
    return property;
  }

  checkImagesInStorage(): { hasImages: boolean, imageCount: number, stepData: any } {
    const allFormData = this.formStorage.getFormData();
    const stepData = allFormData['step2-3'];

    // const hasImages = !!(stepData && stepData.imageFiles && stepData.imageFiles.length > 0);
    // const imageCount = stepData?.imageFiles?.length || 0;

    const imageFiles = this.formStorage.getImageFiles();
    const hasImages = imageFiles.length > 0;
    const imageCount = imageFiles.length;

    return {
      hasImages,
      imageCount,
      stepData
    };
  }

  private ensureHostRole(): Observable<void> {
    const userId = this.authService.userId;
    if (!userId) {
      return throwError(() => new Error('User not logged in'));
    }

    const currentRoles = this.authService.role;
    if (currentRoles.includes('host') || currentRoles.includes("Host")) {
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