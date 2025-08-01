import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService } from '../../core/services/dialog.service';
import { UserService } from '../../core/services/User/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-otp',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './confirm-otp.html',
  styleUrl: './confirm-otp.css',
})
export class ConfirmOtp {
  dialogService = inject(DialogService);
  userService = inject(UserService);

  otp: string = '';
  timer: number = 60;
  resendDisabled: boolean = true;
  timerInterval: any;

  constructor(private snackBar: MatSnackBar) {}
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

  ngAfterViewInit(): void {
    (window as any).startOtpTimerR = () => {
      this.resetTimer();
    };
  }

  resetTimer(): void {
    clearInterval(this.timerInterval);
    this.otp = '';
    this.startTimer();
  }

  startTimer(): void {
    this.timer = 60;
    this.resendDisabled = true;
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.timerInterval);
        this.resendDisabled = false;
      }
    }, 1000);
  }

  close(): void {
    clearInterval(this.timerInterval);
    this.otp = '';
    this.timer = 60;
    this.dialogService.closeDialog();
  }

  resendOtp(): void {
    const email = localStorage.getItem('email');
    if (!email) return;

    this.userService.resendOtp({ email }).subscribe({
      next: (res) => {
        this.otp = '';
        this.startTimer();
      },
      error: (err) => console.error('Resend OTP failed:', err),
    });
  }

  onConfirmOtp(): void {
    const email = localStorage.getItem('email');
    if (!email) return;

    this.userService.confirmOtp({ email, code: this.otp }).subscribe({
      next: () => {
        this.showToast('OTP verified successfully', 'bottom', 'left');
        this.close();
        this.dialogService.openDialog('login');
      },
      error: (err) => {
        this.showToast('OTP verification failed', 'bottom', 'left');
        console.error(err);
      },
    });
  }

  onOtpChange(event: any): void {
    const value = event.target.value.replace(/\D/g, '').slice(0, 6);
    this.otp = value;
  }
}
