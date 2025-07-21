import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from './../../../../environments/environment.development';
import { Property } from './../../models/Property';

interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
  statusCode: number;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  // private readonly baseUrl = environment.baseUrl;
  // private readonly propertyUrl = `${this.baseUrl}/api/Property`;
  private readonly propertyUrl = 'https://localhost:7025/api/property';

  constructor(private http: HttpClient) {}

  getAllProperties(): Observable<Property[]> {
    return this.http.get<ApiResponse<Property[]>>(this.propertyUrl)
    .pipe(
      map(response => response.data)
    );
  }

  getPropertyById(propertyId: number): Observable<Property> {
    const url = `${this.propertyUrl}/${propertyId}`;
    return this.http.get<ApiResponse<Property>>(url)
    .pipe(
      map(response => response.data)
    );
  }
}
