import { Component, Input, OnInit } from '@angular/core';
import { PropertyDisplayDTO } from '../../../../../../core/models/PropertyDisplayDTO';

@Component({
  selector: 'app-property-activate-modal',
  imports: [],
  templateUrl: './property-activate-modal.html',
  styleUrl: './property-activate-modal.css'
})
export class PropertyActivateModal implements OnInit{

  @Input()  currentProperty!: PropertyDisplayDTO | null ;
  newStatus = false;



  ngOnInit(){

    if(this.currentProperty)
      this.newStatus = this.currentProperty?.isActive 
  }

  toggleStatus() {
      this.newStatus = !this.newStatus;
  }

}
