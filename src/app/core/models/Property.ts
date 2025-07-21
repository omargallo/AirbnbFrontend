export interface Property {
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
  images: {
    imageUrl: string;
    isCover: boolean;
    groupName: string;
  }[];
}
