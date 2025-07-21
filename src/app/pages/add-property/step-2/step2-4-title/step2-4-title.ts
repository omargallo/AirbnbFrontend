import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step2-4-title',
  imports: [FormsModule, FooterComponent],
  templateUrl: './step2-4-title.html',
  styleUrl: './step2-4-title.css'
})
export class Step24Title implements AfterViewInit {
  title: string = '';
  maxLength: number = 32;
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLTextAreaElement>;

  get charCount(): number {
    return this.title.length;
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
    if (this.titleInput) {
      const textarea = this.titleInput.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }
}
