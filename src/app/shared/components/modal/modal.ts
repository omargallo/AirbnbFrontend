import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, Output, ViewChild } from '@angular/core';


@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class Modal {
  @Input() title: string = '';
  @Input() isVisible: boolean = false;
  @Input() showCloseBtn: boolean = true;
  @Input() modalClass:any;
  @Input() modalStyle:{[key:string]:any} = {};
  @Input() modalContentClass:any;
  @Input() modalContentStyle:{[key:string]:any} = {} ;
  @Input() modalDialogClass:any;
  @Input() modalDialogStyle:{[key:string]:any} = {} ;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
    // this.isVisible= false
  }
}
