import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../core/services/User/user.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}
  userId: any = (() => {
    const userId = this.authService.userId;
    return userId;
  })();
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

  onUpdateProfile() {
    const updatedUser = {
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      country: this.country,
      birthDate: this.birthDate(),
      bio: this.bio,
    };

    this.userService.updateProfile(this.userId, updatedUser).subscribe({
      next: (res) => {
        alert('Profile updated successfully');
      },
      error: (err) => {
        alert('Profile update failed');
        console.error(err);
      },
    });
  }
}
