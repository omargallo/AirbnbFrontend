import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Observable, map } from 'rxjs';
import { Wishlist } from '../../models/Wishlist';

export interface Result<T> {
  data: T;
  isSuccess: boolean;
  message: string;
  statusCode: number;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly   baseUrl = environment.baseUrl+"/wishlist";

  constructor(private http: HttpClient) {}

  getAllWishlists(): Observable<Wishlist[]> {
    return this.http.get<Result<Wishlist[]>>(this.baseUrl)
      .pipe(
        map(response => response.data)
      );
  }

  createNewWishlist(wishlist: { name: string, notes: string }): Observable<Wishlist> {
    return this.http.post<Result<Wishlist>>(`${this.baseUrl}/create`, wishlist)
      .pipe(
        map(response => response.data)
      );
  }

  deleteWishlist(id: number): Observable<boolean> {
    return this.http.delete<Result<boolean>>(`${this.baseUrl}/${id}`)
      .pipe(
        map(response => response.isSuccess)
      );
  }

  addPropertyToWishlist(wishlistId: number, propertyId: number): Observable<boolean> {
    return this.http.post<Result<boolean>>(`${this.baseUrl}/${wishlistId}/property/${propertyId}`, {})
      .pipe(
        map(response => response.isSuccess)
      );
  }

  removePropertyFromWishlist(wishlistId: number, propertyId: number): Observable<boolean> {
    return this.http.delete<Result<boolean>>(`${this.baseUrl}/${wishlistId}/property/${propertyId}`)
      .pipe(
        map(response => response.isSuccess)
      );
  }
}
