import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { PropertyDisplayDTO } from '../../../../../../core/models/PropertyDisplayDTO';
import { PropertyDisplayWithHostDataDto } from '../../../../../add-property/models/property.model';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../../environments/environment.development';

@Component({
  selector: 'app-property-activate-modal',
  imports: [CommonModule],
  templateUrl: './property-activate-modal.html',
  styleUrl: './property-activate-modal.css'
})
export class PropertyActivateModal implements OnInit{

  @Input()  currentProperty!: PropertyDisplayWithHostDataDto| null ;
  @Output() confirm= new EventEmitter<boolean>()
  @Output() close= new EventEmitter<boolean>()

  imageUrl:string =""
  newStatus = false;
  imageBaseUrl = environment.base


  ngOnInit(){
    console.log("from ActivateModal OnInit")
    if(this.currentProperty)
    {
      this.newStatus = this.currentProperty?.isActive ?? false
      if(this.currentProperty.images && this.currentProperty.images.length > 0)
        this.imageUrl = this.currentProperty.images[0].imageUrl
    } 
  }

  ngOnChanges(changes:SimpleChanges){
    console.log("changes",changes)
  }
  toggleStatus() {
      this.newStatus = !this.newStatus;
  }


  onConfirm(){
    this.confirm.emit(this.newStatus)
  }
  
  onClose(){
    this.close.emit()
  }
}
