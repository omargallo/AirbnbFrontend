import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderCard } from "../../../pages/home/components/slider-card/slider-card";

@Component({
  selector: 'app-slider',
  imports: [CommonModule,  SliderCard],
  templateUrl: './slider.html',
  styleUrl: './slider.css'
})
export class Slider {

  @Input() sectionTitle!: string;
  @Input() listings: any[] = [];
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }



}


 