import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { ViolationService } from '../../../core/services/Admin/violation-service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-violation-modal',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './violation-modal.html',
  styleUrl: './violation-modal.css'
})
export class ViolationModal  implements OnInit, OnChanges{
  isLoading = false;
  canSubmit?: boolean
  responseMessage!:string
  vaiolationText = new FormControl("",[Validators.required])

  @Input() show!:boolean
  @Input() propertyId!:number
  
  @Output() close = new EventEmitter<void>()

  constructor(
      private auth: AuthService,
      private confirm: ConfirmService,
      private violationService: ViolationService,
  ){}

  ngOnInit(): void {
    console.log("from violationModal onInit",this.show)
    if(!this.show)
      return
    
    console.log("------------------- violationModal onInit after return",this.show)
    this.isLoading = true
    this.canSubmitFn()
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("VaiolationModal ngOnchanes enter")
    if(!this.show)
      return
    if(this.canSubmit == undefined){
      this.isLoading = true;
      this.canSubmitFn();
      return;
    }
    
    console.log("VaiolationModal ngOnchanes !canSubmit")
    if(!this.canSubmit){
      this.confirm.fail(this.responseMessage,"")
      this.close.emit()
      return
    }
    if(changes["show"]){
      console.log("VaiolationModal ngOnchanes changes['show']")
      this.show = changes["show"].currentValue
      if(!this.show)
        this.close.emit()
    }
    else
      this.confirm.fail("I don't know why","")

  }


  canSubmitFn(){
    if(!this.propertyId)
    {
      this.isLoading = false
      this.confirm.fail("Something went wrong!","") 
      return
    }

    this.isLoading = true
    this.violationService
          .canSubmit(this.propertyId)
          .subscribe({
            next:(res)=>{
              this.isLoading = false
              if(res.data){
                this.canSubmit = true
                this.show = true                
                console.log("from canSubmit true")
                return;
              }
              this.canSubmit= false
              this.show = false
              this.confirm.fail(res.message,"")
              this.responseMessage = res.message
              console.log("from canSubmit false")
              this.close.emit()
            },
            error:(err)=>{
              console.log(err)
              this.confirm.fail("error","")
              this.isLoading = false
              this.show = false
              this.close.emit()
              console.log("from canSubmit error")
            }
          })

  }

  
  closeModal(){
    this.show = false;
    this.close.emit();
  }

  saveViolation(){
    if(this.vaiolationText.errors)
     {
        this.confirm.fail("Violation Can't be sent empty","");   
       return
    } 
  
    if(!this.vaiolationText.value)
      return
    this.isLoading = true
    console.log(this.vaiolationText.value)
    console.log(this.auth.userId)
    this.violationService
        .sendViolation(
          {
            propertyId: this.propertyId,
            userId: this.auth.userId??'',
            reason:this.vaiolationText.value
          })
          .subscribe({
            next:(res)=>{
                this.isLoading = false
                if(res.isSuccess)
                {
                  this.canSubmit = undefined
                  this.confirm.success("Your Violation has been submitted!","")
                  this.close.emit()
                  return
                }

                this.confirm.fail(res.data,"")
                this.close.emit()

            },
            error:(err)=>{
              this.isLoading = false
              this.confirm.fail("Somothing went wrong, tyr again alter!");
              this.close.emit()
              console.log(err)
            }
          })

          this.vaiolationText.reset();
    
  }
}
