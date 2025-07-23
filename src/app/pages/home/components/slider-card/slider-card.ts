import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-slider-card',
  imports: [CommonModule],
  templateUrl: './slider-card.html',
  styleUrl: './slider-card.css'
})
export class SliderCard {

  @Input() imageUrl!: string;
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() price!: number;
  @Input() rating!: number;
  @Input() isFavorite: boolean = false;



  @Input() propertyId!: number;

  @Output() cardClick = new EventEmitter<number>();

  onCardClick() {
    this.cardClick.emit(this.propertyId);
  }

}