import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { SliderCard } from "../../pages/home/components/slider-card/slider-card";
import { Property } from '../../core/models/Property';

register();

@Component({
  selector: 'app-property-swiper',
  standalone: true,
  imports: [CommonModule, SliderCard],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './mainswiper.html',
  styleUrls: ['./mainswiper.css']
})
export class PropertySwiperComponent implements OnInit {
  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;

  isBeginning = true;
  isEnd = false;



  @Input() properties: Property[] = [];

  ngOnInit(): void {
    setTimeout(() => {
      this.setupSwiperEvents();
    }, 100);
  }

  private setupSwiperEvents(): void {
    const swiperEl = this.swiperEl?.nativeElement;
    if (swiperEl) {
      swiperEl.addEventListener('swiperslidechange', () => {
        this.updateNavigationState();
      });

      swiperEl.addEventListener('swiperreachbeginning', () => {
        this.isBeginning = true;
      });

      swiperEl.addEventListener('swiperreachend', () => {
        this.isEnd = true;
      });

      swiperEl.addEventListener('swiperfrombeginning', () => {
        this.isBeginning = false;
      });

      swiperEl.addEventListener('swiperfromend', () => {
        this.isEnd = false;
      });
    }
  }

  private updateNavigationState(): void {
    const swiperEl = this.swiperEl?.nativeElement;
    if (swiperEl?.swiper) {
      this.isBeginning = swiperEl.swiper.isBeginning;
      this.isEnd = swiperEl.swiper.isEnd;
    }
  }

  slideNext(): void {
    const swiperEl = this.swiperEl?.nativeElement;
    if (swiperEl?.swiper) {
      swiperEl.swiper.slideNext();
    }
  }

  slidePrev(): void {
    const swiperEl = this.swiperEl?.nativeElement;
    if (swiperEl?.swiper) {
      swiperEl.swiper.slidePrev();
    }
  }


  trackByPropertyId(index: number, property: Property): number {
    return property.id;
  }
}