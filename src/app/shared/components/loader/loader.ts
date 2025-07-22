import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports:[CommonModule],
  templateUrl:"./loader.html" ,
  styleUrls: ['./loader.css']
})


export class Loader {

  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'custom' = 'md';
  @Input() color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' = 'primary';
  @Input() loadingText: string = 'Loading...';
  @Input() showText: boolean = false;
  @Input() textColor: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'muted' = 'muted';
  @Input() customSize: string = '';
  @Input() borderWidth: string = '0.25em';
  @Input() containerHeight: string = 'auto';
  @Input() containerClass:any

  get sizeClass(): string {
    switch (this.size) {
      case 'sm': return 'spinner-border-sm';
      case 'lg': return '';
      case 'xl': return '';
      case 'custom': return '';
      default: return '';
    }
  }
}

