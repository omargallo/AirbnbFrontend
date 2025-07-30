import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../core/services/User/user.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HandleImgService } from '../../core/services/handleImg.service';

type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
  offsetX?: number;
  offsetY?: number;
};

@Component({
  selector: 'app-update-profile',
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.css',
})
export class UpdateProfile {
  authService = inject(AuthService);
  constructor(private userService: UserService, private router: Router) {}

  userId = this.authService.userId || '';
  firstName: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser)?.firstName ?? '' : '';
  })();
  lastName: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser)?.lastName ?? '' : '';
  })();
  phoneNumber: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser)?.phoneNumber ?? '' : '';
  })();
  country: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser)?.country ?? '' : '';
  })();

  birthDate: any = () => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser)?.birthDate ?? '' : '';
  };
  bio: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser)?.bio ?? '' : '';
  })();

  handleImgService = inject(HandleImgService);
  user: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser
      ? JSON.parse(storedUser)?.firstName ?? JSON.parse(storedUser)?.userName
      : '';
  })();

  ifImg: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser)?.profilePictureURL ?? '' : '';
  })();

  img: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return this.handleImgService.handleImage(
      storedUser ? JSON.parse(storedUser)?.profilePictureURL ?? '' : ''
    );
  })();

  onUpdateProfile() {
    const updatedUser = {
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      country: this.country,
      birthDate: this.birthDate,
      bio: this.bio,
    };

    this.userService.updateProfile(this.userId, updatedUser).subscribe({
      next: (res) => {
        alert('Profile updated successfully');
        this.userService.getProfile(this.userId).subscribe({
          next: (res) => {
            console.log(res);
            localStorage.setItem('email', res.email);
            localStorage.setItem('user', JSON.stringify(res));
            this.router.navigate(['/profile/' + this.userId]);
          },
          error: (err) => {
            console.error(err);
          },
        });
      },
      error: (err) => {
        alert('Profile update failed');
        console.error(err);
      },
    });
  }

  @ViewChild('uploadDialog') uploadDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('cropCanvas') cropCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cropContainer') cropContainer!: ElementRef<HTMLDivElement>;

  selectedFile: File | null = null;
  previewImageUrl: string | null = null;
  croppedImageBlob: Blob | null = null;

  // Cropping variables
  isDragging = false;
  cropArea: CropArea = { x: 0, y: 0, width: 200, height: 200 };
  imageElement: HTMLImageElement | null = null;
  containerBounds: DOMRect | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFile = file;
      this.previewImageUrl = URL.createObjectURL(file);
      this.uploadDialog?.nativeElement?.showModal();

      // Initialize cropper after dialog opens
      setTimeout(() => {
        this.initializeCropper();
      }, 100);
    }
  }

  initializeCropper() {
    if (!this.previewImageUrl || !this.cropContainer) return;

    this.imageElement = new Image();
    this.imageElement.onload = () => {
      this.setupCropArea();
      this.drawCroppedImage();
    };
    this.imageElement.src = this.previewImageUrl;
  }

  setupCropArea() {
    if (!this.cropContainer || !this.imageElement) return;

    // Get container dimensions
    const containerEl = this.cropContainer.nativeElement;
    const containerWidth = containerEl.offsetWidth;
    const containerHeight = containerEl.offsetHeight;

    // Calculate how the image is displayed (object-fit: contain behavior)
    const imageAspect =
      this.imageElement.naturalWidth / this.imageElement.naturalHeight;
    const containerAspect = containerWidth / containerHeight;

    let displayWidth: number;
    let displayHeight: number;
    let offsetX: number = 0;
    let offsetY: number = 0;

    if (imageAspect > containerAspect) {
      // Image is wider - fit to width
      displayWidth = containerWidth;
      displayHeight = containerWidth / imageAspect;
      offsetY = (containerHeight - displayHeight) / 2;
    } else {
      // Image is taller - fit to height
      displayHeight = containerHeight;
      displayWidth = containerHeight * imageAspect;
      offsetX = (containerWidth - displayWidth) / 2;
    }

    // Store display properties for calculations
    this.imageDisplayProps = {
      width: displayWidth,
      height: displayHeight,
      offsetX: offsetX,
      offsetY: offsetY,
    };

    // Center the crop area within the displayed image
    const cropSize = Math.min(200, displayWidth * 0.6, displayHeight * 0.6);

    this.cropArea = {
      x: offsetX + (displayWidth - cropSize) / 2,
      y: offsetY + (displayHeight - cropSize) / 2,
      width: cropSize,
      height: cropSize,
    };

    this.containerBounds = containerEl.getBoundingClientRect();
    this.drawCroppedImage();
  }

  // Add this property to store image display properties
  imageDisplayProps: {
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
  } | null = null;

  onMouseDown(event: MouseEvent) {
    if (!this.containerBounds || !this.imageDisplayProps) return;

    const rect = this.cropContainer.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is inside crop area
    if (
      x >= this.cropArea.x &&
      x <= this.cropArea.x + this.cropArea.width &&
      y >= this.cropArea.y &&
      y <= this.cropArea.y + this.cropArea.height
    ) {
      this.isDragging = true;
      this.cropArea.offsetX = x - this.cropArea.x;
      this.cropArea.offsetY = y - this.cropArea.y;

      // Prevent default to avoid image dragging
      event.preventDefault();
    }
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging || !this.containerBounds || !this.imageDisplayProps)
      return;

    const rect = this.cropContainer.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left - (this.cropArea.offsetX || 0);
    const y = event.clientY - rect.top - (this.cropArea.offsetY || 0);

    // Constrain crop area within the displayed image bounds
    const minX = this.imageDisplayProps.offsetX;
    const minY = this.imageDisplayProps.offsetY;
    const maxX =
      this.imageDisplayProps.offsetX +
      this.imageDisplayProps.width -
      this.cropArea.width;
    const maxY =
      this.imageDisplayProps.offsetY +
      this.imageDisplayProps.height -
      this.cropArea.height;

    this.cropArea.x = Math.max(minX, Math.min(x, maxX));
    this.cropArea.y = Math.max(minY, Math.min(y, maxY));

    this.drawCroppedImage();
    event.preventDefault();
  }

  drawCroppedImage() {
    if (!this.cropCanvas || !this.imageElement || !this.imageDisplayProps)
      return;

    const canvas = this.cropCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to desired output size
    const outputSize = 200;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Calculate the crop area relative to the displayed image
    const relativeX = this.cropArea.x - this.imageDisplayProps.offsetX;
    const relativeY = this.cropArea.y - this.imageDisplayProps.offsetY;

    // Calculate scale factors from displayed image to original image
    const scaleX =
      this.imageElement.naturalWidth / this.imageDisplayProps.width;
    const scaleY =
      this.imageElement.naturalHeight / this.imageDisplayProps.height;

    // Calculate source coordinates on the original image
    const sourceX = relativeX * scaleX;
    const sourceY = relativeY * scaleY;
    const sourceWidth = this.cropArea.width * scaleX;
    const sourceHeight = this.cropArea.height * scaleY;

    // Ensure source coordinates are within image bounds
    const clampedSourceX = Math.max(
      0,
      Math.min(sourceX, this.imageElement.naturalWidth - sourceWidth)
    );
    const clampedSourceY = Math.max(
      0,
      Math.min(sourceY, this.imageElement.naturalHeight - sourceHeight)
    );
    const clampedSourceWidth = Math.min(
      sourceWidth,
      this.imageElement.naturalWidth - clampedSourceX
    );
    const clampedSourceHeight = Math.min(
      sourceHeight,
      this.imageElement.naturalHeight - clampedSourceY
    );

    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, outputSize, outputSize);

    // Draw cropped portion
    ctx.drawImage(
      this.imageElement,
      clampedSourceX,
      clampedSourceY,
      clampedSourceWidth,
      clampedSourceHeight,
      0,
      0,
      outputSize,
      outputSize
    );

    // Convert to blob for upload
    canvas.toBlob(
      (blob) => {
        this.croppedImageBlob = blob;
      },
      'image/jpeg',
      0.9
    );
  }

  // Add zoom functionality
  zoomOut() {
    if (!this.imageDisplayProps) return;

    const maxSize =
      Math.min(this.imageDisplayProps.width, this.imageDisplayProps.height) *
      0.8;
    const newSize = Math.min(this.cropArea.width + 20, maxSize);

    // Keep crop area centered when zooming
    const deltaSize = newSize - this.cropArea.width;
    this.cropArea.x -= deltaSize / 2;
    this.cropArea.y -= deltaSize / 2;
    this.cropArea.width = newSize;
    this.cropArea.height = newSize;

    // Ensure crop area stays within bounds
    this.constrainCropArea();
    this.drawCroppedImage();
  }

  zoomIn() {
    if (!this.imageDisplayProps) return;

    const minSize = 100;
    const newSize = Math.max(this.cropArea.width - 20, minSize);

    // Keep crop area centered when zooming
    const deltaSize = newSize - this.cropArea.width;
    this.cropArea.x -= deltaSize / 2;
    this.cropArea.y -= deltaSize / 2;
    this.cropArea.width = newSize;
    this.cropArea.height = newSize;

    // Ensure crop area stays within bounds
    this.constrainCropArea();
    this.drawCroppedImage();
  }

  private constrainCropArea() {
    if (!this.imageDisplayProps) return;

    const minX = this.imageDisplayProps.offsetX;
    const minY = this.imageDisplayProps.offsetY;
    const maxX =
      this.imageDisplayProps.offsetX +
      this.imageDisplayProps.width -
      this.cropArea.width;
    const maxY =
      this.imageDisplayProps.offsetY +
      this.imageDisplayProps.height -
      this.cropArea.height;

    this.cropArea.x = Math.max(minX, Math.min(this.cropArea.x, maxX));
    this.cropArea.y = Math.max(minY, Math.min(this.cropArea.y, maxY));
  }

  onMouseUp() {
    this.isDragging = false;
  }

  confirmUpload() {
    if (this.croppedImageBlob) {
      // Create File from Blob
      const croppedFile = new File(
        [this.croppedImageBlob],
        'cropped-profile.jpg',
        {
          type: 'image/jpeg',
        }
      );

      this.userService
        .uploadProfileImage({ userId: this.userId, file: croppedFile })
        .subscribe({
          next: (res) => {
            this.userService.getProfile(this.userId).subscribe({
              next: (res) => {
                console.log(res);
                localStorage.setItem('email', res.email);
                localStorage.setItem('user', JSON.stringify(res));
                this.router.navigate(['/profile/' + this.userId]);
              },
              error: (err) => {
                console.error(err);
              },
            });
            this.closeDialog();
          },
          error: (err) => {
            console.error('Image upload failed:', err);
          },
        });
    }
  }
  closeDialog() {
    this.uploadDialog?.nativeElement?.close();
    this.previewImageUrl = null;
    this.selectedFile = null;
    this.croppedImageBlob = null;
    this.isDragging = false;
  }
}
