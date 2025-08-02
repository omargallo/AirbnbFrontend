import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';

@Component({
  selector: 'app-reserve-confirm-modal',
  imports: [CommonModule,FormsModule],
  templateUrl: './reserve-confirm-modal.html',
  styleUrl: './reserve-confirm-modal.css'
})

export class ReserveConfirmModal implements OnInit{
  @Input() totalPrice!:number
  @Input() pricePerNight!:number
  @Input() checkIn?:dayjs.Dayjs
  @Input() checkOut?:dayjs.Dayjs
  @Input() guestsCount!:number
  @Input() nightsCount!:number

  @Output() confirm = new EventEmitter<void>()
  @Output() close = new EventEmitter<void>()

  ngOnInit(): void {
    console.log("confirmation modal")
    console.log(this.checkIn,this.checkOut)
  }
  onConfirm(){
    this.confirm.emit()
  }
  
  closeModal(){
    this.close.emit();
  }
}
