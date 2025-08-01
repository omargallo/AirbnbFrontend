import { UserProfileDto } from '../ireview';
import { PropertyDisplayDTO } from '../PropertyDisplayDTO';

export interface HostReviewDTO {
  id: number;
  propertyId: number;
  comment?: string;
  privateComment?: string;
  user: UserProfileDto;
  rating: number;
  cleanliness?: number;
  accuracy: number;
  communication?: number;
  location?: number;
  checkIn?: number;
  value?: number;
  createdAt: string;
  property: PropertyDisplayDTO;
}
// export interface PropertyDisplayDTO {
//   id: number;
//   title: string;
//   location: string;
//   imageUrl?: string;
//   averageRating: number;
//   reviewCount: number;
//   city?: string;
//   country?: string;
// }
