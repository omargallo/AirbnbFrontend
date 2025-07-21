// src/app/shared/services/property.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../../models/Property';
import { environment } from '../../../../environments/environment.development';

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
  private baseUrl = `${environment.baseUrl}/Property`;
  private countriesApiUrl = 'https://countriesnow.space/api/v0.1/countries';


  constructor(private http: HttpClient) { }

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

  searchProperties(params: SearchParams): Observable<Result<{ items: Property[] }>> {
    const queryParams: any = {};

    if (params.country) queryParams.Country = params.country;
    if (params.longitude != null) queryParams.Longitude = params.longitude;
    if (params.latitude != null) queryParams.Latitude = params.latitude;
    if (params.guestsCount != null) queryParams.GuestsCount = params.guestsCount;
    if (params.startDate) queryParams.StartDate = params.startDate;
    if (params.endDate) queryParams.EndDate = params.endDate;
    if (params.page) queryParams.Page = params.page;
    if (params.pageSize) queryParams.PageSize = params.pageSize;
    if (params.maxDistanceKm != null) queryParams.maxDistanceKm = params.maxDistanceKm;

    return this.http.get<Result<{ items: Property[] }>>(`${this.baseUrl}/search`, {
      params: queryParams
    });
  }

}
