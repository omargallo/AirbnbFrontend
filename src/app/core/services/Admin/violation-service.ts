import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';

export interface PropertyViolationDetailsDTO {
  id: number;
  reason: string;
  createdAt: Date;
  status: string;
  adminNotes?: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  userEmail?: string;
  propertyId: number;
  propertyTitle: string;
  city: string;
  country: string;
}

export interface UpdateViolationDTO {
  id: number;
  adminNotes?: string;
  status: string;
}

export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
  statusCode: number;
}

export enum PropertyViolationsStatus {
  Pending = 'Pending',
  Solved = 'Solved',
  Dismissed = 'Dismissed'
}

@Injectable({
  providedIn: 'root'
})
export class ViolationService {
  private readonly baseUrl = `${environment.base}/api/Violation`;

  constructor(private http: HttpClient) {}

  /**
   * Get all property violations
   */
  getAllViolations(): Observable<PropertyViolationDetailsDTO[]> {
    return this.http.get<ApiResponse<PropertyViolationDetailsDTO[]>>(`${this.baseUrl}`)
      .pipe(
        map(response => response.data || [])
      );
  }

  /**
   * Get violation by ID
   */
  getViolationById(id: number): Observable<PropertyViolationDetailsDTO> {
    return this.http.get<ApiResponse<PropertyViolationDetailsDTO>>(`${this.baseUrl}/violation/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Update violation
   */
  updateViolation(id: number, updateDto: UpdateViolationDTO): Observable<string> {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/${id}`, updateDto)
      .pipe(
        map(response => response.message || 'Updated successfully')
      );
  }

  /**
   * Get violation status options
   */
  getStatusOptions(): { value: string; label: string; color: string }[] {
    return [
      { value: PropertyViolationsStatus.Pending, label: 'Pending', color: '#fbbf24' },
      { value: PropertyViolationsStatus.Solved, label: 'Solved', color: '#10b981' },
      { value: PropertyViolationsStatus.Dismissed, label: 'Dismissed', color: '#ef4444' }
    ];
  }

  /**
   * Get status color based on status value
   */
  getStatusColor(status: string): string {
    const statusOption = this.getStatusOptions().find(option => option.value === status);
    return statusOption?.color || '#64748b';
  }

  /**
   * Get formatted status label
   */
  getStatusLabel(status: string): string {
    const statusOption = this.getStatusOptions().find(option => option.value === status);
    return statusOption?.label || status;
  }
}