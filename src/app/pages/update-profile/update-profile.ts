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

    this.containerBounds =
      this.cropContainer.nativeElement.getBoundingClientRect();

    // Center the crop area
    const containerWidth = this.containerBounds.width;
    const containerHeight = this.containerBounds.height;

    this.cropArea = {
      x: (containerWidth - 200) / 2,
      y: (containerHeight - 200) / 2,
      width: 200,
      height: 200,
    };

    this.drawCroppedImage();
  }

  onMouseDown(event: MouseEvent) {
    if (!this.containerBounds) return;

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

      // Store offset for smooth dragging
      this.cropArea.offsetX = x - this.cropArea.x;
      this.cropArea.offsetY = y - this.cropArea.y;
    }
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging || !this.containerBounds) return;

    const rect = this.cropContainer.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left - (this.cropArea.offsetX || 0);
    const y = event.clientY - rect.top - (this.cropArea.offsetY || 0);

    // Keep crop area within bounds
    this.cropArea.x = Math.max(
      0,
      Math.min(x, this.containerBounds.width - this.cropArea.width)
    );
    this.cropArea.y = Math.max(
      0,
      Math.min(y, this.containerBounds.height - this.cropArea.height)
    );

    this.drawCroppedImage();
  }

  onMouseUp() {
    this.isDragging = false;
  }

  drawCroppedImage() {
    if (!this.cropCanvas || !this.imageElement || !this.containerBounds) return;

    const canvas = this.cropCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 200;
    canvas.height = 200;

    // Calculate scale factors
    const containerWidth = this.containerBounds.width;
    const containerHeight = this.containerBounds.height;
    const scaleX = this.imageElement.naturalWidth / containerWidth;
    const scaleY = this.imageElement.naturalHeight / containerHeight;

    // Calculate source coordinates on the original image
    const sourceX = this.cropArea.x * scaleX;
    const sourceY = this.cropArea.y * scaleY;
    const sourceWidth = this.cropArea.width * scaleX;
    const sourceHeight = this.cropArea.height * scaleY;

    // Clear canvas
    ctx.clearRect(0, 0, 200, 200);

    // Draw cropped portion
    ctx.drawImage(
      this.imageElement,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      200,
      200
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
