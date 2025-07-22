import { WishlistService } from './../../core/services/Wishlist/wishlist.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Modal } from "../../shared/components/modal/modal";
import { Wishlist } from '../../core/models/Wishlist';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Loader } from "../../shared/components/loader/loader";
import { ConfirmService } from '../../core/services/confirm.service';
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

  isLoading: boolean = true
  isNewModalVisible: boolean = false;
  lists: Wishlist[] = []

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    note: new FormControl('', Validators.required)
  });


  constructor(
    private wishlistService: WishlistService,
    private cdr: ChangeDetectorRef,
    private confirmService: ConfirmService
  ) {
  }




  ngOnInit() {
    if (!this.userId) return;

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
    if (this.form.invalid) return;

    this.onNewModalClose();
    this.isLoading = true;

    const payload = {
      name: this.form.get('name')?.value ?? '',
      notes: this.form.get('note')?.value ?? '',
      propertyIds: [this.propertyId]
    };

    this.form.reset();

    this.wishlistService.createNewWishlist(payload).subscribe({
      next: (response) => {
        this.lists.push(response);
        this.isLoading = false;
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
  }


    getPropertyImage(imgUrl: string): string {
      return `${environment.base}${imgUrl}`;
    }

}
