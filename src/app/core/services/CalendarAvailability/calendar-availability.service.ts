import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@microsoft/signalr';
import { CalendarAvailability } from '../../models/CalendarAvailability';

@Injectable({
  providedIn: 'root',
})
export class CalendarAvailabilityService {
  baseurl = environment.baseUrl;
  calenderURL = `${this.baseurl}/Calendar`;

  constructor(private http: HttpClient) {}

  // getAvailabilityForPropertyId(propertyId: number) {
  //   return this.http.get<CalendarAvailability[]>(`${this.calenderURL}/property/${propertyId}/availability`);
  // }
}
