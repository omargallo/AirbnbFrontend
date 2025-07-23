import { Observable } from 'rxjs';
import { ConfirmService } from './../../core/services/confirm.service';
import { CommonModule } from '@angular/common';
import { Component, resource } from '@angular/core';
import { WishListModal } from "../../components/wish-list-modal/wish-list-modal";
import { PropertySwiperComponent } from "../../components/mainswiper/mainswiper";
import { Property } from '../../core/models/Property';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../core/services/Property/property.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [CommonModule, WishListModal, PropertySwiperComponent, FormsModule],

  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  properties: Property[] = [];
  selectedPropertyId!: number;
  show = false;
  isLoading = false;

  constructor(
      private confirm: ConfirmService,
      private propertyService: PropertyService,
      private router: Router

  ) {

  }

  ngOnInit() {
    this.loadProperties();
  }

  onPropertyClick(id: number) {
      this.router.navigate(['/property',id])
  }
  onWishlistClick(id:number){
    
    this.selectedPropertyId = id;
    this.show = !this.show;
  }

  loadProperties() {
    this.isLoading = true;
    this.propertyService.searchProperties({}).subscribe({
      next: (response) => {
        console.log('🔍 Search Response:', response);

        if (response.isSuccess) {
          this.properties = response.data.items;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ API Error:', err);
        this.isLoading = false;
      },
    });
  }
  // toggleShow() {
  //   this.show = !this.show;
  // }

  listings: {
    imageUrl: string
    title: string,
    subtitle: string,
    price: number,
    rating: number,
    isFavorite: boolean
  }[] = [
      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },

      {
        imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title: "title",
        subtitle: "subtitle",
        price: 10,
        rating: 4.5,
        isFavorite: true
      },


    ]



  // properties: Property[] = [
  //   {
  //     id: 1,
  //     title: 'Modern Condo in Al Shorouk',
  //     description: 'Spacious and fully furnished apartment in a quiet neighborhood.',
  //     city: 'Cairo',
  //     country: 'Egypt',
  //     state: 'Al Shorouk',
  //     latitude: 30.1306,
  //     longitude: 31.6032,
  //     pricePerNight: 27000,
  //     maxGuests: 4,
  //     bedrooms: 2,
  //     beds: 2,
  //     bathrooms: 1,
  //     averageRating: 5.0,
  //     reviewCount: 120,
  //     isActive: true,
  //     isDeleted: false,
  //     propertyTypeId: 1,
  //     hostId: 'host_001',
  //     images: [
  //       {
  //         id: 1,
  //         groupName: 'main',
  //         propertyId: 1,
  //         imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  //         isCover: true,
  //         isDeleted: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     title: 'Stylish Apartment in El Andalos',
  //     description: 'A cozy spot with modern amenities in a prime location.',
  //     city: 'Cairo',
  //     country: 'Egypt',
  //     state: 'New Cairo',
  //     latitude: 30.0205,
  //     longitude: 31.5000,
  //     pricePerNight: 30500,
  //     maxGuests: 3,
  //     bedrooms: 1,
  //     beds: 1,
  //     bathrooms: 1,
  //     averageRating: 4.9,
  //     reviewCount: 95,
  //     isActive: true,
  //     isDeleted: false,
  //     propertyTypeId: 1,
  //     hostId: 'host_002',
  //     images: [
  //       {
  //         id: 2,
  //         groupName: 'main',
  //         propertyId: 2,
  //         imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  //         isCover: true,
  //         isDeleted: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 3,
  //     title: 'Family Apartment in New Cairo City',
  //     description: 'Perfect for families, located near schools and parks.',
  //     city: 'New Cairo',
  //     country: 'Egypt',
  //     state: 'Cairo Governorate',
  //     latitude: 30.0406,
  //     longitude: 31.4789,
  //     pricePerNight: 52200,
  //     maxGuests: 5,
  //     bedrooms: 3,
  //     beds: 3,
  //     bathrooms: 2,
  //     averageRating: 4.9,
  //     reviewCount: 87,
  //     isActive: true,
  //     isDeleted: false,
  //     propertyTypeId: 2,
  //     hostId: 'host_003',
  //     images: [
  //       {
  //         id: 3,
  //         groupName: 'main',
  //         propertyId: 3,
  //         imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  //         isCover: true,
  //         isDeleted: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 4,
  //     title: 'Downtown Cairo Loft',
  //     description: 'Trendy loft apartment in the heart of Cairo.',
  //     city: 'Cairo',
  //     country: 'Egypt',
  //     state: 'Downtown',
  //     latitude: 30.0444,
  //     longitude: 31.2357,
  //     pricePerNight: 56700,
  //     maxGuests: 2,
  //     bedrooms: 1,
  //     beds: 1,
  //     bathrooms: 1,
  //     averageRating: 5.0,
  //     reviewCount: 150,
  //     isActive: true,
  //     isDeleted: false,
  //     propertyTypeId: 3,
  //     hostId: 'host_004',
  //     images: [
  //       {
  //         id: 4,
  //         groupName: 'main',
  //         propertyId: 4,
  //         imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2348&q=80',
  //         isCover: true,
  //         isDeleted: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 5,
  //     title: 'Luxury Apartment in Zamalek',
  //     description: 'Elegant and stylish with Nile views.',
  //     city: 'Cairo',
  //     country: 'Egypt',
  //     state: 'Zamalek',
  //     latitude: 30.0571,
  //     longitude: 31.2243,
  //     pricePerNight: 65900,
  //     maxGuests: 4,
  //     bedrooms: 2,
  //     beds: 2,
  //     bathrooms: 2,
  //     averageRating: 5.0,
  //     reviewCount: 103,
  //     isActive: true,
  //     isDeleted: false,
  //     propertyTypeId: 4,
  //     hostId: 'host_005',
  //     images: [
  //       {
  //         id: 5,
  //         groupName: 'main',
  //         propertyId: 5,
  //         imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  //         isCover: true,
  //         isDeleted: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 6,
  //     title: 'Quiet Retreat in New Cairo',
  //     description: 'Peaceful and green surroundings with fast Wi-Fi.',
  //     city: 'New Cairo',
  //     country: 'Egypt',
  //     state: 'Cairo Governorate',
  //     latitude: 30.0499,
  //     longitude: 31.4770,
  //     pricePerNight: 60200,
  //     maxGuests: 3,
  //     bedrooms: 2,
  //     beds: 2,
  //     bathrooms: 1,
  //     averageRating: 5.0,
  //     reviewCount: 88,
  //     isActive: true,
  //     isDeleted: false,
  //     propertyTypeId: 2,
  //     hostId: 'host_006',
  //     images: [
  //       {
  //         id: 6,
  //         groupName: 'main',
  //         propertyId: 6,
  //         imageUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  //         isCover: true,
  //         isDeleted: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 7,
  //     title: 'Bright Apartment in New Cairo',
  //     description: 'A bright space with excellent natural light.',
  //     city: 'New Cairo',
  //     country: 'Egypt',
  //     state: 'Cairo Governorate',
  //     latitude: 30.0500,
  //     longitude: 31.4800,
  //     pricePerNight: 78650,
  //     maxGuests: 4,
  //     bedrooms: 2,
  //     beds: 2,
  //     bathrooms: 2,
  //     averageRating: 4.92,
  //     reviewCount: 65,
  //     isActive: true,
  //     isDeleted: false,
  //     propertyTypeId: 2,
  //     hostId: 'host_007',
  //     images: [
  //       {
  //         id: 7,
  //         groupName: 'main',
  //         propertyId: 7,
  //         imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  //         isCover: true,
  //         isDeleted: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 8,
  //     title: 'Modern Flat in Downtown',
  //     description: 'All the essentials, plus easy metro access.',
  //     city: 'Cairo',
  //     country: 'Egypt',
  //     state: 'Downtown',
  //     latitude: 30.0435,
  //     longitude: 31.2333,
  //     pricePerNight: 56700,
  //     maxGuests: 2,
  //     bedrooms: 1,
  //     beds: 1,
  //     bathrooms: 1,
  //     averageRating: 4.98,
  //     reviewCount: 73,
  //     isActive: true,
  //     isDeleted: false,
  //     propertyTypeId: 3,
  //     hostId: 'host_008',
  //     images: [
  //       {
  //         id: 8,
  //         groupName: 'main',
  //         propertyId: 8,
  //         imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2348&q=80',
  //         isCover: true,
  //         isDeleted: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 9,
  //     title: 'Zamalek Executive Apartment',
  //     description: 'Perfect for business travelers with high-end finishes.',
  //     city: 'Cairo',
  //     country: 'Egypt',
  //     state: 'Zamalek',
  //     latitude: 30.0560,
  //     longitude: 31.2300,
  //     pricePerNight: 66000,
  //     maxGuests: 3,
  //     bedrooms: 2,
  //     beds: 2,
  //     bathrooms: 2,
  //     averageRating: 4.98,
  //     reviewCount: 111,
  //     isActive: true,
  //     isDeleted: false,
  //     propertyTypeId: 4,
  //     hostId: 'host_009',
  //     images: [
  //       {
  //         id: 9,
  //         groupName: 'main',
  //         propertyId: 9,
  //         imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  //         isCover: true,
  //         isDeleted: false
  //       }
  //     ]
  //   },
  //   {
  //     id: 10,
  //     title: 'New Cairo Garden Apartment',
  //     description: 'Enjoy a small garden in a secure compound.',
  //     city: 'New Cairo',
  //     country: 'Egypt',
  //     state: 'Cairo Governorate',
  //     latitude: 30.0510,
  //     longitude: 31.4750,
  //     pricePerNight: 60000,
  //     maxGuests: 4,
  //     bedrooms: 2,
  //     beds: 2,
  //     bathrooms: 2,
  //     averageRating: 5.0,
  //     reviewCount: 92,
  //     isActive: true,
  //     isDeleted: false,
  //     propertyTypeId: 2,
  //     hostId: 'host_010',
  //     images: [
  //       {
  //         id: 10,
  //         groupName: 'main',
  //         propertyId: 10,
  //         imageUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  //         isCover: true,
  //         isDeleted: false
  //       }
  //     ]
  //   }
  // ];
  onClose() {

    this.show = false
  }
  onFinish(observable: Observable<boolean>) {
    this.onClose()
    observable.subscribe(
      {
        next: (success) => {
          if (success)
            this.confirm.success("Success", "Property added to wish list")
          else
            this.confirm.fail("Faild", "Coundn't add the property")
        },
        error: () =>
          this.confirm.fail("Faild", "Coundn't add the property")

      }
    )
  }


}
