import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PropertyAmenity } from '../../models/PropertyAmenity';
import { Amenity } from '../../models/Amenity';

@Injectable({
  providedIn: 'root'
})
export class PropertyAmenityService {
    baseurl = environment.baseUrl;
    propertyURL = `${this.baseurl}/Amenity`;

  constructor(private http: HttpClient) {}

  getAllAmenitiesByPropertyId(propertyId: number) {
    return this.http.get<PropertyAmenity[]>(`${this.propertyURL}/property/${propertyId}/amenities`);
  }


  // If you need to get all amenities when you become a host 
  getAllAmenities() {
    return this.http.get<Amenity[]>(`${this.propertyURL}/all`);
  }
  
}
