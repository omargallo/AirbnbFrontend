import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface AdminPaymentDTO {
  paymentId: number;
  hostAccountCompleted: boolean;
  guestName: string;
  hostName: string;
  amount: number;
  platformFee: number;
  hostAmount: number;
  paymentStatus: string;
  transferStatus: string;
  paymentDate: string; // Changed to string to match your service
  bookingId: number;
  hostId: string;
}

export interface TransferResponse {
  success: boolean;
  message: string;
}

export interface PaginatedResult<T> {
  items: T[];
  metaData: PaginationMetaData;
}

export interface PaginationMetaData {
  page: number;
  pageSize: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  // private apiUrl = 'https://localhost:7025/api/payments';
    private readonly apiUrl = `${environment.baseUrl}/payments`;


  constructor(private http: HttpClient) {}

  getAllPayments(page: number = 1, pageSize: number = 10): Observable<PaginatedResult<AdminPaymentDTO>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResult<AdminPaymentDTO>>(`${this.apiUrl}/payments`, { params });
  }

  transferToHost(paymentId: number): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(`${this.apiUrl}/transfer/${paymentId}`, {});
  }

  getPaymentDetails(paymentId: number): Observable<AdminPaymentDTO> {
    return this.http.get<AdminPaymentDTO>(`${this.apiUrl}/payment/${paymentId}`);
  }
}