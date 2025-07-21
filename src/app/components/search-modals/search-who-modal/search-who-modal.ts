import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Guest } from '../../search-filter-group/search-filter-group';

@Component({
  selector: 'app-search-who-modal',
  templateUrl: './search-who-modal.html',
  styleUrls: ['./search-who-modal.css','../../search-filter-group/search-filter-group.css','../../header/header.css'],
  imports:[TranslateModule,FormsModule,CommonModule]
})
export class SearchWhoModal {

   @Input() guests: Guest[] = [];

  incrementGuest(index: number): void {
    if (this.guests[index].count < this.guests[index].max) {
      this.guests[index].count++;
    }
  }

  decrementGuest(index: number): void {
    if (this.guests[index].count > this.guests[index].min) {
      this.guests[index].count--;
    }
  }


}
