import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

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
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AmenityService {
  private readonly baseUrl = `${environment.base}/api/Amenity`;

  constructor(private http: HttpClient) { }

  getAllAmenities(): Observable<AmenityDTO[]> {
    return this.http.get<ApiResponse<AmenityDTO[]>>(`${this.baseUrl}/all`).pipe(
      map(response => response.data)
    );
  }

  assignAmenityToProperty(amenityId: number, propertyId: number): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/assign/${amenityId}/porperty/${propertyId}`, {});
  }
}
