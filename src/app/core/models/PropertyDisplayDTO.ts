import { PropertyImage } from './PropertyImage';
import { Amenity } from './Amenity';
import { PropertyAmenity } from './PropertyAmenity';
import { CalendarAvailability } from './CalendarAvailability';
import { Booking } from './Booking';
import { PropertyType } from './PropertyType';
import { User } from './user';
import { Wishlist } from './Wishlist';

export interface PropertyDisplayDTO {
    id: number;
    title: string;
    description: string;
    city: string;
    country: string;
    state: string;
    latitude: number;
    longitude: number;
    pricePerNight: number;
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    averageRating: number;
    reviewCount: number;
    isActive: boolean;
    isDeleted: boolean;
    propertyTypeId: number;
    hostId: string;

    // Navigation properties
    propertyType?: PropertyType;
    host?: User;
    amenities?: Amenity[];
    propertyAmenities?: PropertyAmenity[];
    calendarAvailabilities?: CalendarAvailability[];
    wishlist?: Wishlist[];
    images?: PropertyImage[];
    bookings?: Booking[];
}
