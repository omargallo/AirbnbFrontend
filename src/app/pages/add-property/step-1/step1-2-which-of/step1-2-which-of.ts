import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../../layout/add-property-layout/wizard-layout/footer/footer';

@Component({
  selector: 'app-step1-2-which-of',
  imports: [CommonModule, FooterComponent],
  templateUrl: './step1-2-which-of.html',
  styleUrl: './step1-2-which-of.css'
})
export class Step12WhichOf {
  propertyTypes = [
    'House', 'Apartment', 'Barn', 'Bed & breakfast', 'Boat', 'Cabin', 'Camper/RV', 'Casa particular', 'Castle', 'Cave',
    'Container', 'Cycladic home', 'Dammuso', 'Dome', 'Earth home', 'Farm', 'Guesthouse', 'Hotel', 'Houseboat', 'Kezhan',
    'Minsu', 'Riad', 'Ryokan', "Shepherd's hut", 'Tent', 'Tiny home', 'Tower', 'Treehouse', 'Trullo', 'Windmill', 'Yurt'
  ];
  selectedType: string = this.propertyTypes[0];

  selectType(type: string) {
    this.selectedType = type;
  }
}
