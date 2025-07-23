import { Component } from '@angular/core';

@Component({
  selector: 'app-reservation-box',
  templateUrl: './reservation-box.html',
  styleUrls: ['./reservation-box.css']
})
export class ReservationBoxComponent {
  showBookingDetails = false;

  reservation = {
    image: 'assets/images/deafult.png',
    status: 'REQUEST DECLINED',
    hostMessage: 'Leanna is unable to host your trip.',
    propertyName: 'Coastal and Bright Oceanfront Condo',
    propertyType: 'Entire condo • Ocean City, MD, US',
    hostName: 'Leanna',
    hostReviews: '167 reviews',
    hostAvatar: 'https://a0.muscache.com/im/pictures/user/a2e486a2-4167-42d1-87c7-58e97e912627.jpg?aki_policy=profile_medium',
    checkIn: 'Nov 7, 2025',
    checkOut: 'Nov 9, 2025',
    guests: '1 adult',
    pricePerNight: '10,052.24 ج.م',
    nights: 2,
    subtotal: '20,104.48 ج.م',
    taxes: '1,937.91 ج.م',
    total: '22,042.39 ج.م'
  };

  // showPropertyDetails() {
  //   this.showBookingDetails = !this.showBookingDetails;
  // }

  keepSearching() {
    // Handle keep searching action
    console.log('Keep searching clicked');
  }

  closeReservation() {
    // Handle close reservation
    console.log('Close reservation clicked');
  }

  reportHost() {
    // Handle report host action
    console.log('Report host clicked');
  }
}