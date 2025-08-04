import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../core/services/User/user.service';
import { DialogService } from '../../core/services/dialog.service';
import { ConfirmOtp } from '../confirm-otp/confirm-otp';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, ConfirmOtp],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  email: string = '';
  password: string = '';
  togglePass = false;

  dialogService = inject(DialogService);

  constructor(
    private userService: UserService,
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

  onRegister() {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
    if (!passwordRegex.test(this.password)) {
      this.showToast(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 12 characters long.',
        'bottom',
        'left'
      );
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.email)) {
      this.showToast('Please enter a valid email address', 'bottom', 'left');
      return;
    }
    this.userService
      .register({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          localStorage.setItem('email', this.email);
          localStorage.removeItem('user');
          this.showToast('Registered successfully', 'bottom', 'left');
          this.close();
          this.dialogService.openDialog('confirmOtp');
          (window as any).startOtpTimerR?.();
        },
        error: (err) => {
          this.showToast('Register failed', 'bottom', 'left');
          console.error(err);
        },
      });
  }

  showPass() {
    this.togglePass = !this.togglePass;
  }

  close() {
    this.dialogService.closeDialog();
  }
}
