import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../core/services/User/user.service';
import { DialogService } from '../../core/services/dialog.service';
import { HandleImgService } from '../../core/services/handleImg.service';

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

  email: string = '';
  password: string = '';

  dialogService = inject(DialogService);

  constructor(private userService: UserService) {}

  onLogin() {
    this.userService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          alert('Logged in successfully');
          this.close();
          this.userService.getProfile(res.userId).subscribe({
            next: (res) => {
              console.log(res);
              localStorage.setItem('email', res.email);
              localStorage.setItem('user', JSON.stringify(res));
            },
            error: (err) => {
              console.error(err);
            },
          });
        },
        error: (err) => {
          alert('Login failed');
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
    if (this.email !== '') {
      alert('Please enter your email');
      return;
    }
    localStorage.setItem('email', this.email);
    this.userService.resendOtp({ email: this.email }).subscribe({
      next: () => {
        alert('OTP sent successfully');
      },
      error: (err) => {
        alert('OTP sending failed');
        console.error(err);
      },
    });
    this.dialogService.openDialog('forgotPassword');
  }

  showPass() {
    this.togglePass = !this.togglePass;
  }
}
