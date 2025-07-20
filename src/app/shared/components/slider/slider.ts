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
  @Input() cardPerSlide: number = 1;
    cardGap:number = 16;

  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;

  cardWidth: number = 0;
  isAtStart = true;
  isAtEnd = false;

  ngAfterViewInit() {
    setTimeout(() => {
      this.calculateCardWidth();
      this.updateButtonStates();
      this.calculateGap()
    });
      const container = this.scrollContainer.nativeElement;
      container.addEventListener('wheel', this.handleWheelScroll.bind(this), { passive: false });

  }

  
  @HostListener('window:resize')
  onResize() {
    this.calculateCardWidth();
  }
  
  handleWheelScroll(event: WheelEvent) {
  const container = this.scrollContainer.nativeElement;

  // Only handle vertical scroll
  if (event.deltaY !== 0) {
    event.preventDefault(); // prevent vertical scroll of the page
    container.scrollBy({
      left: event.deltaY,
      behavior: 'smooth'
    });
  }
}

  
  private calculateGap(){
    const cardElems = this.scrollContainer.nativeElement.querySelectorAll('.card-item');
    if (cardElems.length >= 2) {
      const firstCard = cardElems[0] as HTMLElement;
      const secondCard = cardElems[1] as HTMLElement;
      this.cardGap = secondCard.offsetLeft - (firstCard.offsetLeft + firstCard.offsetWidth);
}

  }
  private calculateCardWidth() {
    const containerWidth = this.scrollContainer.nativeElement.offsetWidth;
    this.cardWidth = Math.floor(containerWidth / this.cardsPerView);

    
    const cards = this.scrollContainer.nativeElement.querySelectorAll(':scope >*');

    cards.forEach((card: HTMLElement) => {
      card.style.minWidth = `${this.cardWidth}px`;
      card.style.maxWidth = `${this.cardWidth}px`;
    });

    this.updateButtonStates();
  }
  getRootFontSize(){
    const rootFontSizeStr = getComputedStyle(document.documentElement).fontSize;
    const rootFontSizePx = parseFloat(rootFontSizeStr);

    return rootFontSizePx; 
  }
  calcSpaceToMove():number{
    this.calculateGap()

    const clientWidth = this.scrollContainer.nativeElement.clientWidth;

    const totalCardWidth = this.cardWidth * this.cardPerSlidePrivate;
    const totalGap = this.cardGap * (this.cardPerSlidePrivate - 1);
    console.log("totalGap ", totalGap)
    console.log("totalCardWidth", totalCardWidth)
    // const leftoverSpace = clientWidth % (this.cardWidth + this.cardGap);
    
    const visibleCardArea = this.cardsPerView * this.cardWidth + (this.cardsPerView - 1) * this.cardGap;
    const leftoverSpace = visibleCardArea -clientWidth ;
    
    const scrollDistance = totalCardWidth +totalGap + leftoverSpace;
    
  
    return scrollDistance
}
  scrollLeft() {
     
    this.scrollContainer.nativeElement.scrollBy({
      left: -this.calcSpaceToMove(),
      behavior: 'smooth'
    });

  setTimeout(() => this.updateButtonStates(), 300);
  }

  scrollRight() {
  this.scrollContainer.nativeElement.scrollBy({
    left: this.calcSpaceToMove(),
    behavior: 'smooth'
  });

  setTimeout(() => this.updateButtonStates(), 300);
}

get cardPerSlidePrivate():number{
  return this.cardPerSlide
}
  private updateButtonStates() {
    const el = this.scrollContainer.nativeElement;
    this.isAtStart = el.scrollLeft === 0;
    this.isAtEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;
  }
}
