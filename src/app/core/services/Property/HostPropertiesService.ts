import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';

export interface PropertyImageDisplayDTO {
  id: number;
  groupName: string;
  propertyId: number;
  imageUrl: string;
  isCover: boolean;
  isDeleted: boolean;
}

export interface PropertyDisplayDTO {
  id: number;
  title: string;
  description: string;
  city: string;
  country: string;
  state: string;
  latitude: number;
  longitude: number;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  averageRating: number;
  reviewCount: number;
  isActive: boolean;
  isDeleted: boolean;
  propertyTypeId: number;
  hostId: string;
  images?: PropertyImageDisplayDTO[];
}

interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
  statusCode: number;
}

@Injectable({
  providedIn: 'root'
})
export class HostPropertiesService {
  private readonly apiUrl = `${environment.baseUrl}/Property`;

  constructor(private http: HttpClient) { }

  getPropertiesByHostId(hostId: string): Observable<PropertyDisplayDTO[]> {
    return this.http
      .get<ApiResponse<PropertyDisplayDTO[]>>(`${this.apiUrl}/host/cover/${hostId}`)
      .pipe(map(response => response.data));
  }
}