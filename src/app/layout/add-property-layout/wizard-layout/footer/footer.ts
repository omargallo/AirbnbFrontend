import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  @Input() currentStep: number = 0; // 0 means not started
  @Input() totalSteps: number = 3; // Main step groups (1, 2, 3)
  @Input() canProceed: boolean = true; // Fixed: Added missing Input

  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() getStarted = new EventEmitter<void>();

  // Always show 3 segments for the main step groups
  readonly SEGMENT_COUNT = 3;

  onBackClick(): void {
    this.back.emit();
  }

  onNextClick(): void {
    if (this.canProceed) {
      this.next.emit();
    }
  }

  onGetStartedClick(): void {
    this.getStarted.emit();
  }

  get progressSegments(): number[] {
    return Array(this.SEGMENT_COUNT).fill(0).map((_, i) => i);
  }

  getSegmentFill(index: number): number {
    // Calculate which main group we're in (1, 2, or 3)
    const currentMainStep = Math.ceil(this.currentStep / this.getStepsPerMainGroup());
    
    // Previous segments should be fully filled
    if (index < currentMainStep - 1) return 100;
    
    // Future segments should be empty
    if (index > currentMainStep - 1) return 0;
    
    // Current segment should show partial progress
    const stepsInGroup = this.getStepsPerMainGroup();
    const currentGroupStart = (currentMainStep - 1) * stepsInGroup + 1;
    const progressInGroup = this.currentStep - currentGroupStart + 1;
    
    return Math.round((progressInGroup / stepsInGroup) * 100);
  }

  private getStepsPerMainGroup(): number {
    return Math.ceil(this.totalSteps / this.SEGMENT_COUNT);
  }

  get isLastStep(): boolean {
    return this.currentStep >= this.totalSteps;
  }

  get showGetStarted(): boolean {
    return this.currentStep === 0;
  }

  // Fixed: Added missing isCurrentSegment method
  isCurrentSegment(index: number): boolean {
    const currentMainStep = Math.ceil(this.currentStep / this.getStepsPerMainGroup());
    return index === currentMainStep - 1;
  }
}