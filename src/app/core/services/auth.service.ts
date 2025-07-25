import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly accessTokenKey = 'accessToken';
  private readonly refreshTokenKey = 'refreshToken';
  private readonly userIdKey = 'userId';
  private readonly roleKey = 'role';

  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  private userIdSubject = new BehaviorSubject<string | null>(null);
  private roleSubject = new BehaviorSubject<string[] | null>(null);

  constructor(private cookieService: CookieService) {
    this.accessTokenSubject.next(this.cookieService.get(this.accessTokenKey) || null);
    this.refreshTokenSubject.next(this.cookieService.get(this.refreshTokenKey) || null);
    this.userIdSubject.next(this.cookieService.get(this.userIdKey) || null);

    const roleRaw = this.cookieService.get(this.roleKey);
    this.roleSubject.next(roleRaw ? JSON.parse(roleRaw) : null);
  }

  setAccessToken(token: string) {
    this.cookieService.set(this.accessTokenKey, token, 7, '/');
    this.accessTokenSubject.next(token);
  }

  setRefreshToken(token: string) {
    this.cookieService.set(this.refreshTokenKey, token, 7, '/');
    this.refreshTokenSubject.next(token);
  }

  setUserId(userId: string) {
    this.cookieService.set(this.userIdKey, userId, 7, '/');
    this.userIdSubject.next(userId);
  }

  setRole(roles: []) {
    this.cookieService.set(this.roleKey, JSON.stringify(roles), 7, '/');
    this.roleSubject.next(roles);
  }

  get accessToken(): string | null {
    const val = this.cookieService.get(this.accessTokenKey) || null;
    this.accessTokenSubject.next(val);
    return val;
  }

  get refreshToken(): string | null {
    const val = this.cookieService.get(this.refreshTokenKey) || null;
    this.refreshTokenSubject.next(val);
    return val;
  }

  get userId(): string | null {
    const val = this.cookieService.get(this.userIdKey) || null;
    this.userIdSubject.next(val);
    return val;
  }

  get role(): string[] | null {
    const raw = this.cookieService.get(this.roleKey);
    const parsed = raw ? JSON.parse(raw) : null;
    this.roleSubject.next(parsed);
    return parsed;
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

  clear() {
    this.cookieService.delete(this.accessTokenKey, '/');
    this.cookieService.delete(this.refreshTokenKey, '/');
    this.cookieService.delete(this.userIdKey, '/');
    this.cookieService.delete(this.roleKey, '/');

    this.accessTokenSubject.next(null);
    this.refreshTokenSubject.next(null);
    this.userIdSubject.next(null);
    this.roleSubject.next(null);
  }
}
