import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface PaymentDTO {
  id: number;
  amount: number;
  currency: string;
  status: number;
  bookingId: number;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  paymentDate: Date;
  isTransferredToHost?: boolean;
  transferStatus: number;
  hostAmount?: number;
  platformFee?: number;
  transferDate?: Date | null;
  transferId?: string | null;
  userId: string;
}
export interface CreatePaymentDTO {
  bookingId: number;
  amount: number;
}

export interface CheckoutResponse {
  url: string;
  success: boolean;
  error?: string;
  details?: string;
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

export interface PaymentSummaryResponse {
  success: boolean;
  summary: any;
  message?: string;
}

export interface RevenueResponse {
  success: boolean;
  revenue: number;
  message?: string;
}

export interface GenericResponse {
  success: boolean;
  message?: string;
}

export interface SinglePaymentResponse {
  success: boolean;
  payment: PaymentDTO;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiUrl = `${environment.baseUrl}/payments`;

  constructor(private http: HttpClient) { }

  // Create checkout session
  createCheckout(paymentData: CreatePaymentDTO): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.apiUrl}/checkout`, paymentData);
  }

  // Create/finalize Stripe Express account
  createStripeAccount(email: string, userId: string): Observable<CreateAccountResponse> {
    const params = new HttpParams()
      .set('email', email)
      .set('userId', userId);

    return this.http.post<CreateAccountResponse>(`${this.apiUrl}/finalize-account`, null, { params });
  }

  // Transfer payment to host
  transferToHost(paymentId: number): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(`${this.apiUrl}/transfer/${paymentId}`, {});
  }

  // Get pending payments for a specific host
  getHostPendingPayments(hostId: string): Observable<PendingPaymentsResponse> {
    return this.http.get<PendingPaymentsResponse>(`${this.apiUrl}/host/${hostId}/pending`);
  }

  // Get payment summary for host
  getHostPaymentSummary(hostId: string): Observable<PaymentSummaryResponse> {
    return this.http.get<PaymentSummaryResponse>(`${this.apiUrl}/host/${hostId}/summary`);
  }

  // Get all payments for host with optional status filter
  getHostPayments(hostId: string, status?: string): Observable<PendingPaymentsResponse> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<PendingPaymentsResponse>(`${this.apiUrl}/host/${hostId}`, { params });
  }

  // Admin: Process all pending transfers
  processPendingTransfers(): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(`${this.apiUrl}/process-pending-transfers`, {});
  }

  // Admin: Get platform revenue
  getPlatformRevenue(startDate?: string, endDate?: string): Observable<RevenueResponse> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<RevenueResponse>(`${this.apiUrl}/admin/revenue`, { params });
  }

  // Get payment by booking ID
  getPaymentByBookingId(bookingId: number): Observable<SinglePaymentResponse> {
    return this.http.get<SinglePaymentResponse>(`${this.apiUrl}/booking/${bookingId}`);
  }
}
