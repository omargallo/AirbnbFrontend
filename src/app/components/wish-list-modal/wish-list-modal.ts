import { WishlistService } from './../../core/services/Wishlist/wishlist.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Modal } from "../../shared/components/modal/modal";
import { Wishlist } from '../../core/models/Wishlist';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Loader } from "../../shared/components/loader/loader";
import { ConfirmService } from '../../core/services/confirm.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

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
  @Output() finish = new EventEmitter<Observable<boolean>>()

  isLoading: boolean = true
  isNewModalVisible: boolean = false;
  lists: Wishlist[] = []

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    note: new FormControl('',)
  });


  constructor(
    private wishlistService: WishlistService,
    private cdr: ChangeDetectorRef,
    private confirmService: ConfirmService
  ) {
  }




  ngOnInit() {

    this.userId = "1";
    console.log(this.isNewModalVisible)
    if (!this.userId)
      return
    this.isLoading = true
    this.wishlistService.getByUserIdWithCover(this.userId)
      .subscribe(
        {
          next: (response) => {
            console.log("loaded", response)
            this.lists = response?.data ?? [];
            this.cdr.detectChanges();
            this.isLoading = false
            console.log(this.isNewModalVisible)

          },
          error: (error) => {
            this.isLoading = false;
            console.log("from Modal ngOninit error")
            console.log(error);
          }
        }
      )


    this.isLoading = true;

    this.wishlistService.getAllWishlists()
      .subscribe({
        next: (response) => {
          console.log("All wishlists loaded", response);
          this.lists = response;
          this.cdr.detectChanges();
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Error loading wishlists:", error);
        }
      });
  }
  onWishListClicik(wishlistId: number) {
    console.log("wishlist and property id ", wishlistId, this.propertyId)
    if (!wishlistId || !this.propertyId) {
      this.confirmService.fail("Failed", "Something went wrong, try again!");
      return
    }
    let obj = this.wishlistService
      .addPropertyToWishlist(wishlistId, this.propertyId)
    this.onResponse(obj)
    this.close.emit()
  }



  onClose() {
    this.close.emit()
  }
  onNewModalClose() {
    this.isNewModalVisible = false
  }
  showNewModal() {
    this.isNewModalVisible = true
    this.show = false
  }


  onResponse(obj: Observable<boolean>) {
    console.log("from wishlist modal on response")
    this.finish.emit(obj)
  }
  getPropertyImage(imgUrl: string): string {
    return `${environment.base}${imgUrl}`;
  }


  onCreateNewWishlist() {
    if (!this.form.get('name')?.valid) return;

    const payload = {
      name: this.form.get('name')?.value ?? '',
      notes: this.form.get('note')?.value ?? '',
      propertyIds: [this.propertyId]
    };

    this.onNewModalClose();
    this.isLoading = true;

    this.wishlistService.createNewWishlist(payload).subscribe({
      next: (response) => {
        this.lists.push(response.data);
        this.isLoading = false;
        this.confirmService.success("", "property added");
      },
      error: (error) => {
        this.isLoading = false;
        console.log("couldn't create new wishlist", error);
        this.confirmService.show(
          "Fail",
          "Something went wrong, try again!",
          () => { },
          {
            okText: 'Ok',
            isPrompt: true,
            isSuccess: false
          }
        );
      }
    });

    this.form.reset();
  }

}
