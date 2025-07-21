
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotosService } from '../../../../core/services/photos.service';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step2-3-3-photos-ta-da',
  imports: [CommonModule, FooterComponent],
  templateUrl: './step2-3-3-photos-ta-da.html',
  styleUrl: './step2-3-3-photos-ta-da.css'
})
export class Step233PhotosTaDa {
  constructor(public photosService: PhotosService) {}

  dragStartIndex: number | null = null;

  addPhotos(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input?.files) return;
    const files = input.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        this.readFile(file);
      }
    }
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.photosService.addPhoto(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  removePhoto(index: number): void {
    this.photosService.removePhoto(index);
  }

  onDragStart(index: number): void {
    this.dragStartIndex = index;
  }

  onDrop(index: number): void {
    if (this.dragStartIndex !== null && this.dragStartIndex !== index) {
      this.photosService.reorderPhotos(this.dragStartIndex, index);
    }
    this.dragStartIndex = null;
  }
}
