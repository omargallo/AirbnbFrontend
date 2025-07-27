import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface CalendarDateDTO {
  date: string;
  isAvailable: boolean;
  price: number;
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
export class CalendarService {
  private readonly apiUrl = `${environment.baseUrl}/Calendar`;

  constructor(private http: HttpClient) { }

  getPropertyCalendar(propertyId: number, startDate?: string, endDate?: string): Observable<CalendarDateDTO[]> {
    let url = `${this.apiUrl}/property/${propertyId}`;
    const query: string[] = [];

    if (startDate) query.push(`startDate=${startDate}`);
    if (endDate) query.push(`endDate=${endDate}`);

    if (query.length > 0) {
      url += `?${query.join('&')}`;
    }

    return this.http.get<ApiResponse<CalendarDateDTO[]>>(url)
      .pipe(map(res => res.data));
  }

  // 🟡 Update calendar dates for property
  updatePropertyCalendar(propertyId: number, dates: CalendarDateDTO[]): Observable<boolean> {
    const url = `${this.apiUrl}/property/${propertyId}`;
    return this.http.put<ApiResponse<boolean>>(url, dates)
      .pipe(map(res => res.data));
  }
}
