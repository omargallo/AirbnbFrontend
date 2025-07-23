import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface HostProfile {
  id: string;
  firstName: string;
  lastName: string;
  profilePictureURL: string;
  bio: string;
  country: string;
  birthDate: string;
  createdAt: string;
  userName?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HostprofileService { 
  private apiUrl = `${environment.baseUrl}/User`;

  constructor(private http: HttpClient) { }

  getHostProfile(hostId: string): Observable<HostProfile> {
    return this.http.get<HostProfile>(`${this.apiUrl}/profile?id=${hostId}`);
  }
}