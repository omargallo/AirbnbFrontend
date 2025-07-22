import { Injectable } from '@angular/core';
import { Toast } from '../../shared/components/toast/toast';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastRef!: Toast;

  register(toast: Toast) {
    this.toastRef = toast;
  }

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000) {
    this.toastRef?.show(message, type, duration);
  }
}
