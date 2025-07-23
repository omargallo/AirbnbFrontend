import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private activeDialogSubject = new BehaviorSubject<string | null>(null);
  activeDialog$ = this.activeDialogSubject.asObservable();

  openDialog(dialogName: string) {
    this.activeDialogSubject.next(dialogName);
  }

  closeDialog() {
    this.activeDialogSubject.next(null);
  }

  isDialogOpen(dialogName: string): boolean {
    return this.activeDialogSubject.value == dialogName;
  }
}
