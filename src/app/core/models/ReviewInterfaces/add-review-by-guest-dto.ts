export interface AddReviewByGuestDTO {
  propertyId: number;
  // bookingId: number;

  comment: string;
  privateComment?: string;
  rating: number;
  cleanliness: number;
  accuracy: number;
  communication: number;
  location: number;
  checkIn: number;
  value: number;
  // userId: string | null;
}
