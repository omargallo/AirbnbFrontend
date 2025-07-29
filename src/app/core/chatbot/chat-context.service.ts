import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatContextService {
  private homeContext: string = '';
  private dynamicContext: string = '';


  setHomeContext(data: string): void {
    this.homeContext = data;
  }


  setDynamicContext(data: string): void {
    this.dynamicContext = data;
  }


  appendDynamicContext(additionalData: string): void {
    this.dynamicContext += '\n' + additionalData;
  }


  getContext(): string {
    return `${this.homeContext}\n${this.dynamicContext}`.trim();
  }


  clearDynamicContext(): void {
    this.dynamicContext = '';
  }


  clearAllContext(): void {
    this.homeContext = '';
    this.dynamicContext = '';
  }
}
