import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService } from '../../core/services/dialog.service';
import { UserService } from '../../core/services/User/user.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  password: string = '';
  otp: string = '';
  togglePass = false;
  dialogService = inject(DialogService);

  constructor(private userService: UserService) {}
  onResetPassword() {
    const email = localStorage.getItem('email');
    if (!email) {
      alert('Email not found');
      return;
    }
    this.userService.resetPass({ email, newPassword: this.password, code: this.otp }).subscribe({
      next: () => {
        alert('Password reset successfully');
        this.close();
      },
      error: (err) => {
        alert('Password reset failed');
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

  onOtpChange(event: any): void {
    const value = event.target.value.replace(/\D/g, '').slice(0, 6);
    this.otp = value;
  }
}
