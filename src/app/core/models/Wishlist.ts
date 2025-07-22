export interface Wishlist {
  id: number;
  name: string;
  notes: string;
  createdAt: string;
  userId: string;
  propertyIds: number[];
  coverImageUrl: string;
}