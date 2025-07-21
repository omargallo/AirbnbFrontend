import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PropertyImage } from '../../models/PropertyImage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyImageService {

  baseurl = environment.baseUrl;
  property_Images_URL = `${this.baseurl}/Property`;

    constructor(private http: HttpClient) {}

  getAllImagesByPropertyId(propertyId: number): Observable<PropertyImage[]> {
    return this.http.get<PropertyImage[]>(`${this.property_Images_URL}/${propertyId}/images`);
  }



}
