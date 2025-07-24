import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CalendarAvailability } from '../../models/CalendarAvailability';
import { HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

// src/app/shared/models/calendar-check-availability.dto.ts

export interface CalendarCheckResponse {
  data: CalendarCheckData;
  isSuccess: boolean;
  message: string;
  statusCode: number;
}

export interface CalendarCheckData {
  isAvailable: boolean;
  unavailableDates: string[]; 
  totalPrice: number;
  message: string;
}

export interface Result<T> {
  data: T;
  isSuccess: boolean;
  message: string;
}

@Injectable({    providedIn: 'root' })

@Injectable({
  providedIn: 'root',
})
export class CalendarAvailabilityService {

      baseurl = environment.baseUrl;
      calenderURL = `${this.baseurl}/Calendar`;

      
      constructor(private http: HttpClient) {}
      
        reverseIThink(
                  propertyId: number,
                  startDate: string,
                  endDate: string,
                  // totalPrice:number

                ): Observable<CalendarCheckResponse> {
                  const params = new HttpParams()
                    .set('startDate', startDate)
                    .set('endDate', endDate);
                    // .set('totalPrice',totalPrice)

                  return this.http.get<CalendarCheckResponse>(
                    `${this.baseurl}/property/${propertyId}`,
                    { params }
                  );
                }

      checkAvailability(propertyID:Number):Observable<CalendarCheckData>{
          const url = `${this.calenderURL}/property/${propertyID}/availability`;

        return this.http.get<Result<CalendarCheckData>>(url)
            .pipe(
              map(response => response.data)
            );
        }




        
      }
  constructor(private http: HttpClient) {}

  // getAvailabilityForPropertyId(propertyId: number) {
  //   return this.http.get<CalendarAvailability[]>(`${this.calenderURL}/property/${propertyId}/availability`);
  // }
}
