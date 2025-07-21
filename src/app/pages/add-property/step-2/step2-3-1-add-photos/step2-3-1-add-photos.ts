import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';
import { Step232PhotosModal } from '../step2-3-2-photos-modal/step2-3-2-photos-modal';
import { Router } from '@angular/router';
import { PhotosService } from '../../../../core/services/photos.service';

@Component({
  selector: 'app-step2-3-add-photos',
  imports: [CommonModule, FooterComponent, Step232PhotosModal],
  templateUrl: './step2-3-1-add-photos.html',
  styleUrl: './step2-3-1-add-photos.css'
})
export class Step23AddPhotos {
  dropzoneHighlight = false;

  constructor(
    public photosService: PhotosService,
    private router: Router
  ) {}

  @ViewChild('photosModal') photosModal!: Step232PhotosModal;

  openPhotosModal(): void {
    this.photosModal.openModal();
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    this.dropzoneHighlight = false;
    if (event.dataTransfer?.files) {
      this.openPhotosModal();
    }
  }
}
