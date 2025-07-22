import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  visible = signal(false);
  title = '';
  message = '';
  isPrompt: boolean = false;
  oKText: string = 'Confirm';
  cancelText: string = 'Cancel';
  isSuccess: boolean = true;
  callback: () => void = () => {};

  show(
    title: string,
    message: string,
    onConfirm: () => void,
    {
      okText = 'Confirm',
      isSuccess = true,
      isPrompt = false,
      cancelText = 'Cancel',
    }: {
      okText?: string;
      isSuccess?: boolean;
      isPrompt?: boolean;
      cancelText?: string;
    } = {}
  ) {
    this.isPrompt = isPrompt ?? false;
    this.oKText = okText ?? 'Confirm';
    this.cancelText = cancelText ?? 'Cancel';
    this.isSuccess = isSuccess ?? true;
    this.title = title;
    this.message = message;
    this.callback = onConfirm;
    this.visible.set(true);
  }

  confirm() {
    this.callback();
    this.visible.set(false);
  }

  cancel() {
    this.visible.set(false);
  }
}
