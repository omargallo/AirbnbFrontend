import { WishlistService } from './../../core/services/Wishlist/wishlist.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Modal } from "../../shared/components/modal/modal";
import { Wishlist } from '../../core/models/Wishlist';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Loader } from "../../shared/components/loader/loader";
import { ConfirmService } from '../../core/services/confirm.service';

@Component({
  selector: 'app-wish-list-modal',
  imports: [Modal, CommonModule, ReactiveFormsModule, Loader],
  templateUrl: './wish-list-modal.html',
  styleUrls: ['./wish-list-modal.css']
})
export class WishListModal implements OnInit {
  @Input() propertyId!: number;
  @Input() show: boolean = false
  @Input() userId?: string;
  @Output() close = new EventEmitter<void>()

  isLoading:boolean = true
  isNewModalVisible: boolean = false;
  lists: Wishlist[] = []

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    note: new FormControl('', Validators.required)
  });


  constructor(
    private wishlistService: WishlistService,
    private cdr: ChangeDetectorRef,
    private confirmService:ConfirmService
  ) 
  {
  }




  ngOnInit() {
    console.log(this.isNewModalVisible)
    if (!this.userId)
      return
    this.isLoading = true
    this.wishlistService.getByUserIdWithCover(this.userId)
      .subscribe(
        {
          next: (response) => {
            console.log("loaded", response)
            this.lists = response.data;
            this.cdr.detectChanges();
            this.isLoading = false
            console.log(this.isNewModalVisible)

          },
          error: (error) => {
            this.isLoading = false;
            console.log(error);
          }
        }
      )
  }

  onClose() {
    this.close.emit()
  }
  onNewModalClose() {
    this.isNewModalVisible = false
    this.show = true
  }
  showNewModal() {
    this.isNewModalVisible = true
    this.show = false
  }

  onCreateNewWishlist() {
    if (!this.form.get('name')?.valid || !this.form.get('note')?.valid)
      return

    this.onNewModalClose()
    this.isLoading= true;
    this.form.reset()
    this.wishlistService
      .createNewWishlist(
        {
          name: this.form.get('name')?.value ?? '',
          notes: this.form.get('note')?.value ?? ''
        })
      .subscribe(
        {
          next: (response) => {
            this.lists.push(response.data)
            this.isLoading = false
          },
          error: (error) => {
            this.isLoading = false
            console.log("couldn't create new wishlist", error)
            this.confirmService.show(
              "Fail",
              "Something went wrong, try again!",
              ()=>{},
              {
                okText:'Ok',
                isPrompt:true,
                isSuccess:false
              }
            )
          }
        }
      )
  }
}
