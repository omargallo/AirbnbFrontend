import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../core/services/User/user.service';
import { DialogService } from '../../core/services/dialog.service';
import { HandleImgService } from '../../core/services/handleImg.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/Notification/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  handleImgService = inject(HandleImgService);
  @Input() user: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser)?.firstName ?? '' : '';
  })();

  ifImg: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser)?.profilePictureURL ?? '' : '';
  })();

  @Input() img: string | null = (() => {
    const storedUser = localStorage.getItem('user');
    return this.handleImgService.handleImage(
      storedUser ? JSON.parse(storedUser)?.profilePictureURL ?? '' : ''
    );
  })();

  @Input() lastLoginEmail: string = localStorage.getItem('email') || '';
  togglePass = false;
  maskEmail(email: string): string {
    const [username, domain] = email.split('@');

    if (!username || !domain) return email;

    const visibleStart = username.slice(0, 2);
    const visibleEnd = username.slice(-2);

    const maskedMiddle = '•'.repeat(Math.max(username.length - 4, 0));

    return `${visibleStart}${maskedMiddle}${visibleEnd}@${domain}`;
  }

  email: string = localStorage.getItem('email') || '';
  password: string = '';

  dialogService = inject(DialogService);

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  private showToast(
    message: string,
    vertical: 'top' | 'bottom',
    horizontal: 'left' | 'right'
  ) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: horizontal,
      verticalPosition: vertical,
      panelClass: ['custom-snackbar'],
    });
  }

  onLogin() {
    this.userService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          this.showToast('Logged in successfully', 'bottom', 'left');
          this.close();
          const userId = res.userId;
          const roles = res.roles.toString();
          this.userService.getProfile(userId).subscribe({
            next: (res) => {
              console.log(res);
              localStorage.setItem('email', res.email);
              localStorage.setItem('user', JSON.stringify(res));
              if (roles.includes('Admin')) {
                this.router.navigate(['/AdminDashboard']);
                return;
              }
              let message = '';
              if (res.firstName === null) {
                message = `Welcome to Airbnb`;
              } else {
                message = `Welcome to Airbnb ${res.firstName || res.userName}`;
              }
              this.notificationService
                .createNotification({
                  userId,
                  message,
                })
                .subscribe({
                  next: () => {
                    console.log('Notification created successfully');
                  },
                  error: (err) => {
                    this.showToast('Notification creation failed', 'bottom', 'left');
                    console.error('Notification creation failed:', err);
                  },
                });
              (window as any).Logging?.();

              if (res.firstName === null) {
                this.router.navigate(['/take-info/' + this.authService.userId]);
              } else {
                this.router.navigate(['/']);
              }
            },
            error: (err) => {
              this.showToast('Profile not found', 'bottom', 'left');
              console.error(err);
            },
          });
        },
        error: (err) => {
          this.showToast(`Login failed: ${err.error.error}`, 'bottom', 'left');
          console.error(err);
        },
      });
  }

  close() {
    this.dialogService.closeDialog();
  }

  switchToRegister() {
    this.dialogService.openDialog('register');
  }

  switchToForgot() {
    let email = localStorage.getItem('email');

    if (this.email && this.email.trim() !== '') {
      email = this.email.trim();
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      this.showToast('Please enter a valid email address', 'bottom', 'left');
      return;
    }

    this.userService.resendOtp({ email: email as string }).subscribe({
      next: () => {
        this.showToast('OTP sent successfully', 'bottom', 'left');
        this.dialogService.openDialog('resetPassword');
        (window as any).startOtpTimer?.();
      },
      error: (err) => {
        this.showToast('OTP sending failed', 'bottom', 'left');
        console.error(err);
      },
    });
  }

  showPass() {
    this.togglePass = !this.togglePass;
  }
}
