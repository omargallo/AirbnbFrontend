import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BookingDTO {
  userId: string;
  propertyId: number;
  checkInDate: string; //  ISO  format 
  checkOutDate: string;
  numberOfGuests: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly apiUrl = `${environment.baseUrl}/Booking`;

  constructor(private http: HttpClient) {}
  
  createBooking(booking: BookingDTO): Observable<any> {
      return this.http.post(`${this.apiUrl}`, booking);
  }


  
}
