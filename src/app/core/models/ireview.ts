export interface UserProfileDto {
  userId: string;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bio?: string;
  birthDate?: string;
  country?: string;
  profilePictureURL?: string;
}

export interface Ireview {
  id: number; // lowercase alias for Id
  propertyId: number; // lowercase alias for PropertyId
  userId?: string; // For frontend convenience
  comment?: string; // lowercase alias for Comment
  rating: number; // lowercase alias for Rating
  cleanliness?: number; // lowercase alias
  accuracy?: number; // lowercase alias
  communication?: number; // lowercase alias
  checkIn?: number; // lowercase alias
  location?: number; // lowercase alias
  value?: number; // lowercase alias
  createdAt?: string; // lowercase alias
  user?: UserProfileDto; // lowercase alias
}
