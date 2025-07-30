import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';

interface ApiResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface AmenityDTO {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AmenityService {
  private readonly baseUrl = `${environment.base}/api/Amenity`;

  constructor(private http: HttpClient) {}

  getAllAmenities(): Observable<AmenityDTO[]> {
    return this.http.get<ApiResponse<AmenityDTO[]>>(`${this.baseUrl}/all`).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      })
    );
  }

  getAmenitiesByPropertyId(propertyId: number): Observable<AmenityDTO[]> {
    return this.http.get<ApiResponse<AmenityDTO[]>>(`${this.baseUrl}/property/${propertyId}/amenities`).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      })
    );
  }

  togglePropertyAmenity(amenityId: number, propertyId: number): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/assign/${amenityId}/porperty/${propertyId}`, {}).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message);
        }
        return response.data;
      })
    );
  }

  assignAmenitiesToProperty(propertyId: number, amenityIds: number[]): Observable<any> {
    // Using forkJoin to execute all togglePropertyAmenity calls in parallel
    return new Observable(observer => {
      const assignments = amenityIds.map(amenityId => 
        this.togglePropertyAmenity(amenityId, propertyId)
      );

      // Execute assignments sequentially to avoid overwhelming the server
      let completedAssignments = 0;
      const processNextAssignment = () => {
        if (completedAssignments >= assignments.length) {
          observer.complete();
          return;
        }

        assignments[completedAssignments].subscribe({
          next: () => {
            completedAssignments++;
            processNextAssignment();
          },
          error: (error) => {
            observer.error(error);
          }
        });
      };

      processNextAssignment();
    });
  }
}
