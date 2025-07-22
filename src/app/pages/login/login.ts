import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../core/services/User/user.service';
import { DialogService } from '../../core/services/dialog.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  @Input() user: string = 'bbb';
  @Input() img: string = '1';
  @Input() lastLoginEmail: string = 'kkkkkkk@gmail.com';
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
    this.dialogService.openDialog('forgotPassword');
  }
}
