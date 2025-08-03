import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private firstTimeRefresh = true;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) { }




  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isExternalRequest = req.url.startsWith('https://countriesnow.space');

    if (isExternalRequest) {
      return next.handle(req);
    }

    if(this.firstTimeRefresh){
      let x = this.handle401Error(req,next)
      console.log("after handle401error");
      x.subscribe()
    }

    console.log(this.authService.role)
    const accessToken = this.authService.accessToken;

    if (accessToken) {
      req = this.addToken(req, accessToken);
    }

    req = req.clone({
      withCredentials: true
    });

    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !req.url.includes('/auth/login')) {
          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      })
    );
  }




  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      
      return this.authService.refreshTokenBackend$().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.firstTimeRefresh = false;
          this.authService.setAccessToken(token.accessToken);
          // this.refreshTokenSubject.next(token.refreshToken);
          this.authService.setUserId(token.userId);
          this.authService.setRole(token.roles);
          return next.handle(this.addToken(request, token.accessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.firstTimeRefresh = false;
          // this.authService.clear();
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => next.handle(this.addToken(request, token!)))
      );
    }
  }





  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
