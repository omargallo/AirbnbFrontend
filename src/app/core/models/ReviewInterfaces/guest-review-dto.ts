export interface EditReviewByGuestDTO {
  id: number;
  propertyId: number;
  bookingId: number;
  comment: string;
  privateComment?: string;
  rating: number;
  cleanliness: number;
  accuracy: number;
  communication: number;
  checkIn: number;
  location: number;
  value: number;
}

export interface IGuestReviewDto {
  id: number;
  propertyId: number;
  bookingId: number;
  userId: string;
  comment: string;
  privateComment?: string;
  rating: number;
  cleanliness: number;
  accuracy: number;
  communication: number;
  checkIn: number;
  location: number;
  value: number;
  createdAt: string;
  updatedAt?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}