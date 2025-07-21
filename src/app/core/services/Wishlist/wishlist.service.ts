import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Property } from '../../models/Property';
import { Observable } from 'rxjs';
import { Wishlist } from '../../models/Wishlist';

export interface Result<T>{
  data:T
  isSucces:boolean
  message:string
}
@Injectable({
  providedIn: 'root'
})

export class WishlistService {
  baseUrl = environment.baseUrl+"/wishlist"
  constructor(private http:HttpClient){}

  getByUserIdWithCover(userId:string):Observable<Result<Wishlist[]>>{
    return this.http.get<Result<Wishlist[]>>(`${this.baseUrl}`)
  }
  createNewWishlist(wishlist:{name:string,notes:string}):Observable<Result<Wishlist>>{
    return this.http.post<Result<Wishlist>>(`${this.baseUrl}/create`,wishlist)
  }
}
