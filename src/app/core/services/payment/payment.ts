import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface PaymentDTO {
  id: number;
  amount: number;
  currency: string;
  status: string;
  bookingId: number;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  paymentDate: Date;
  isTransferredToHost: boolean;
}

export interface CreatePaymentDTO {
  bookingId: number;
  amount: number;
  currency: string;
}

export interface CheckoutResponse {
  url: string;
  success: boolean;
}

export interface CreateAccountResponse {
  url: string;
  success: boolean;
  message?: string;
}

export interface PendingPaymentsResponse {
  success: boolean;
  payments: PaymentDTO[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiUrl = `${environment.baseUrl}/payments`;

  constructor(private http: HttpClient) {}

  createCheckout(paymentData: CreatePaymentDTO): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.apiUrl}/checkout`, paymentData);
  }

  createStripeAccount(email: string, userId: string): Observable<CreateAccountResponse> {
    const params = new HttpParams()
      .set('email', email)
      .set('userId', userId);

    return this.http.post<CreateAccountResponse>(`${this.apiUrl}/create-account`, null, { params });
  }

  getPendingPaymentsForHost(userId: string): Observable<PendingPaymentsResponse> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<PendingPaymentsResponse>(`${this.apiUrl}/pending-for-host`, { params });
  }
}
