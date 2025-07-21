import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  @Output() exit = new EventEmitter<void>();
  @Output() questions = new EventEmitter<void>();
  @Output() saveExit = new EventEmitter<void>();

  onExitClick(): void {
    this.exit.emit();
  }
  onQuestionsClick(): void {
    this.questions.emit();
  }
  onSaveExitClick(): void {
    this.saveExit.emit();
  }
}