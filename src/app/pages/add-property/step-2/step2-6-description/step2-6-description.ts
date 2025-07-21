import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step2-6-description',
  imports: [FormsModule, FooterComponent],
  templateUrl: './step2-6-description.html',
  styleUrl: './step2-6-description.css'
})
export class Step26Description implements AfterViewInit {
  description: string = 'Have fun with the whole family at this stylish place.';
  maxLength: number = 500;
  @ViewChild('descriptionInput') descriptionInput!: ElementRef<HTMLTextAreaElement>;

  get charCount(): number {
    return this.description.length;
  }

  get limitReached(): boolean {
    return this.charCount >= this.maxLength;
  }

  ngAfterViewInit() {
    this.autoResize();
  }

  onInput() {
    this.autoResize();
  }

  autoResize() {
    if (this.descriptionInput) {
      const textarea = this.descriptionInput.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }
}
