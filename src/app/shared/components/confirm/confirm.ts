import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomInput } from '../custom-input/custom-input';
import { Button } from '../button/button';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm.html',
  styleUrls: ['./confirm.css'],
})
export class Confirm {
  constructor(public confirm: ConfirmService) {}

  isDarkMode() {
    return document.body.classList.contains('dark-mode');
  }
}
