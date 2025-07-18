import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  private userIdSubject = new BehaviorSubject<string | null>(null);
  private roleSubject = new BehaviorSubject<string | null>(null);

  setAccessToken(token: string) {
    this.accessTokenSubject.next(token);
  }

  setRefreshToken(token: string) {
    this.refreshTokenSubject.next(token);
  }

  setUserId(userId: string) {
    this.userIdSubject.next(userId);
  }

  setRole(role: string) {
    this.roleSubject.next(role);
  }

  get accessToken$() {
    return this.accessTokenSubject.asObservable();
  }

  get refreshToken$() {
    return this.refreshTokenSubject.asObservable();
  }

  get userId$() {
    return this.userIdSubject.asObservable();
  }

  get role$() {
    return this.roleSubject.asObservable();
  }

  get accessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  get refreshToken(): string | null {
    return this.refreshTokenSubject.value;
  }

  get userId(): string | null {
    return this.userIdSubject.value;
  }

  get role(): string | null {
    return this.roleSubject.value;
  }

  clear() {
    this.accessTokenSubject.next(null);
    this.refreshTokenSubject.next(null);
    this.userIdSubject.next(null);
    this.roleSubject.next(null);
  }
}
