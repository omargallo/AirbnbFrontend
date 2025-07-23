// src/app/shared/services/property.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Property } from '../../models/Property';
import { environment } from '../../../../environments/environment.development';

interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
  statusCode: number;
}

export interface Result<T> {
  data: T;
  isSuccess: boolean;
  message: string;
}
export interface Country {
  iso2: string;
  iso3: string;
  country: string;
  cities: string[];
}
export interface CountriesResponse {
  error: boolean;
  msg: string;
  data: Country[];
}
interface SearchPropertiesResponse {
  items: Property[];
  metaData: {
    page: number;
    pageSize: number;
    total: number;
  };
}
export interface SearchParams {
  country?: string;
  longitude?: number;
  latitude?: number;
  guestsCount?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  maxDistanceKm?: number;

}

@Injectable({
  providedIn: 'root',
})
export class PropertyService {

  // private readonly baseUrl = environment.baseUrl;
  // private readonly propertyUrl = `${this.baseUrl}/api/Property`;
  private readonly propertyUrl = `${environment.baseUrl}/property`;


  private baseUrl = `${environment.baseUrl}/Property`;
  private countriesApiUrl = 'https://countriesnow.space/api/v0.1/countries';


  constructor(private http: HttpClient) { }

  uploadPhotos(formData:FormData){
    return this.http.post(`${this.baseUrl}/property-images/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    })
  }
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


  getNearestProperties(page: number = 1, pageSize: number = 10, maxDistanceKm: number = 10): Observable<Result<{ items: Property[] }>> {
    const headers = new HttpHeaders()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('maxDistanceKm', maxDistanceKm.toString());

    return this.http.get<Result<{ items: Property[] }>>(`${this.baseUrl}/nearest`, { headers });
  }


  getAllCountries(): Observable<CountriesResponse> {
    return this.http.get<CountriesResponse>(this.countriesApiUrl);
  }

  searchProperties(params: SearchParams): Observable<Result<SearchPropertiesResponse>> {
    const queryParams: any = {};

    if (params.country) queryParams.Country = params.country;
    if (params.longitude != null) queryParams.Longitude = params.longitude;
    if (params.latitude != null) queryParams.Latitude = params.latitude;
    if (params.guestsCount != null) queryParams.GuestsCount = params.guestsCount;
    if (params.startDate) queryParams.StartDate = params.startDate;
    if (params.endDate) queryParams.EndDate = params.endDate;
    if (params.page) queryParams.Page = params.page;
    // if (params.pageSize) queryParams.PageSize = params.pageSize;
    queryParams.PageSize = 9;
    if (params.maxDistanceKm != null) queryParams.maxDistanceKm = params.maxDistanceKm;

    return this.http.get<Result<SearchPropertiesResponse>>(`${this.baseUrl}/search`, {
      params: queryParams
    });
  }


}
