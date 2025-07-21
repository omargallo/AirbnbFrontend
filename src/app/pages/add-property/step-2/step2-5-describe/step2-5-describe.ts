import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step2-5-describe',
  imports: [CommonModule, FooterComponent],
  templateUrl: './step2-5-describe.html',
  styleUrl: './step2-5-describe.css'
})
export class Step25Describe {
  highlights = [
    { key: 'peaceful', label: 'Peaceful', icon: 'peaceful' },
    { key: 'unique', label: 'Unique', icon: 'unique' },
    { key: 'family', label: 'Family-friendly', icon: 'family' },
    { key: 'stylish', label: 'Stylish', icon: 'stylish' },
    { key: 'central', label: 'Central', icon: 'central' },
    { key: 'spacious', label: 'Spacious', icon: 'spacious' }
  ];
  selected: string[] = [];
  maxSelections = 2;

  isSelected(key: string): boolean {
    return this.selected.includes(key);
  }

  selectHighlight(key: string): void {
    const idx = this.selected.indexOf(key);
    if (idx > -1) {
      this.selected.splice(idx, 1);
    } else {
      if (this.selected.length < this.maxSelections) {
        this.selected.push(key);
      } else {
        // Optionally, trigger a visual cue in the template
      }
    }
  }
}
