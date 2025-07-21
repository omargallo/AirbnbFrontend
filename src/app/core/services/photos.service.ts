import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PhotosService {
  private _photos: string[] = [];

  get photos(): string[] {
    return this._photos;
  }

  set photos(newPhotos: string[]) {
    this._photos = newPhotos;
  }

  addPhoto(photo: string): void {
    this._photos.push(photo);
  }

  removePhoto(index: number): void {
    this._photos.splice(index, 1);
  }

  clearPhotos(): void {
    this._photos = [];
  }

  reorderPhotos(from: number, to: number): void {
    const movedPhoto = this._photos[from];
    this._photos.splice(from, 1);
    this._photos.splice(to, 0, movedPhoto);
  }
}
