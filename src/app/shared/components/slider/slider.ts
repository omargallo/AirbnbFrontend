import { Component } from '@angular/core';
import {
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-slider',
  imports: [],
  templateUrl: './slider.html',
  styleUrl: './slider.css'
})

export class Slider implements AfterViewInit {
  @Input() cardsPerView: number = 3;

  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;

  cardWidth: number = 0;
  isAtStart = true;
  isAtEnd = false;

  ngAfterViewInit() {
    setTimeout(() => {
      this.calculateCardWidth();
      this.updateButtonStates();
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateCardWidth();
  }

  private calculateCardWidth() {
    const containerWidth = this.scrollContainer.nativeElement.offsetWidth;
    this.cardWidth = Math.floor(containerWidth / this.cardsPerView);

    const cards = this.scrollContainer.nativeElement.querySelectorAll(':scope >*');
    console.log("heeeere")
    cards.forEach((card: HTMLElement) => {
      card.style.minWidth = `${this.cardWidth}px`;
      card.style.maxWidth = `${this.cardWidth}px`;
    });

    this.updateButtonStates();
  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -this.cardWidth * this.cardsPerView,
      behavior: 'smooth'
    });
    setTimeout(() => this.updateButtonStates(), 300);
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: this.cardWidth * this.cardsPerView,
      behavior: 'smooth'
    });
    setTimeout(() => this.updateButtonStates(), 300);
  }

  private updateButtonStates() {
    const el = this.scrollContainer.nativeElement;
    this.isAtStart = el.scrollLeft === 0;
    this.isAtEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;
  }
}
