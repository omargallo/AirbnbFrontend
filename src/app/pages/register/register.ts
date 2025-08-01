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

  constructor(private userService: UserService, private snackBar: MatSnackBar) {}
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
    this.userService
      .register({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          localStorage.setItem('email', this.email);
          this.showToast('Registered successfully', 'bottom', 'left');
          this.close();
          this.dialogService.openDialog('confirmOtp');
          (window as any).startOtpTimerR?.();
          localStorage.removeItem('user')
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
