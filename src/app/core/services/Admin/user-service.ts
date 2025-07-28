import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';


export interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  bio?: string;
  birthDate?: string;
  country?: string;
  profilePictureURL?: string;
  isConfirmed: boolean;
  createAt: string;
  updatedAt: string;
  emailConfirmed: boolean;
}

export interface UserProfileDto {
  userId: string;
  userName?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  bio?: string;
  birthDate?: string;
  country?: string;
  profilePictureURL?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.baseUrl}/User`;

  constructor(private http: HttpClient) {}

  
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/get-all-users`);
  }


  getUserProfile(userId: string): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>(`${this.apiUrl}/profile/${userId}`);
  }
}