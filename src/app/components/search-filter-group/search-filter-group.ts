import {
  Component,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  AfterViewInit,
  HostListener,
  NgZone,
  OnDestroy
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import moment from 'moment';
import { SearchWhereModal } from "../search-modals/search-where-modal/search-where-modal";
import { SearchDateModal } from "../search-modals/search-date-modal/search-date-modal";
import { SearchWhoModal } from "../search-modals/search-who-modal/search-who-modal";
import { CommonModule } from '@angular/common';

export interface Guest {
  label: string;
  subLabel: string;
  count: number;
  min: number;
  max: number;
}

@Component({
  selector: 'app-search-filter-group',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    NgxDaterangepickerMd,
    SearchWhereModal,
    SearchDateModal,
    SearchWhoModal,
  ],
  templateUrl: './search-filter-group.html',
  styleUrls: ['./search-filter-group.css','../header/header.css'],
})
export class SearchFilterGroupComponent implements AfterViewInit, OnDestroy {
  isSearchBarSticky = false;

  selectedDateRange = {
    startDate: null as moment.Moment | null,
    endDate: null as moment.Moment | null,
  };

  activeFilter = '';
  isModalVisible = false;
  isModalAnimatingOut = false;

  indicatorLeft = 0;
  indicatorWidth = 0;
  indicatorHeight = 0;

  modalTop = 0;
  modalLeft = 0;

  private modalObserver?: MutationObserver;
  private boundClickHandler = this.handleClickOutside.bind(this);

  @ViewChild('filterGroupRef') filterGroupRef!: ElementRef;
  @ViewChild('modalRef') modalRef!: ElementRef;
  @ViewChild('whereRef') whereRef!: ElementRef;
  @ViewChild('dateRef') dateRef!: ElementRef;
  @ViewChild('whoRef') whoRef!: ElementRef;

  constructor(private ngZone: NgZone) { }

  get isAnyFilterActive(): boolean {
    return this.activeFilter !== '';
  }

  ngAfterViewInit() {
    document.addEventListener('click', this.boundClickHandler);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.boundClickHandler);
    if (this.modalObserver) this.modalObserver.disconnect();
  }

  setActive(filter: string) {
    this.activeFilter = filter;
    this.openSearchModal(filter);
  }

  openSearchModal(filter: string) {
    this.activeFilter = filter;
    this.isModalVisible = true;
    this.isModalAnimatingOut = false;

    setTimeout(() => {
      this.updateIndicator();
      this.setupModalObserver();
    }, 0);
  }

  closeSearchModal() {
    if (!this.isModalVisible) return;
    this.isModalAnimatingOut = true;
    this.activeFilter = '';
    this.updateIndicator();

    if (this.modalObserver) {
      this.modalObserver.disconnect();
      this.modalObserver = undefined;
    }

    setTimeout(() => {
      this.ngZone.run(() => {
        this.isModalVisible = false;
        this.activeFilter = '';
        this.indicatorWidth = 0;
      });
    }, 500);
  }

  onModalAnimationEnd() {
    if (this.isModalAnimatingOut) {
      this.ngZone.run(() => {
        this.isModalVisible = false;
        this.isModalAnimatingOut = false;
        this.activeFilter = '';
        this.indicatorWidth = 0;
      });
    }
  }

  handleClickOutside(event: MouseEvent) {
    if (!this.isModalVisible && !this.isModalAnimatingOut) return;

    const groupEl = this.filterGroupRef.nativeElement as HTMLElement;
    const modalEl = this.modalRef?.nativeElement as HTMLElement;
    const clickedEl = event.target as Node;

    const clickedInsideGroup = groupEl.contains(clickedEl);
    const clickedInsideModal = modalEl?.contains(clickedEl);

    if (!clickedInsideGroup && !clickedInsideModal) {
      this.ngZone.run(() => {
        this.closeSearchModal();
      });
    }
  }

  private setupModalObserver() {
    if (this.modalRef && this.modalRef.nativeElement && !this.modalObserver) {
      this.modalObserver = new MutationObserver(() => {
        if (this.isModalVisible && this.activeFilter) {
          this.updateIndicator();
        }
      });

      this.modalObserver.observe(this.modalRef.nativeElement, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }
  }

  updateIndicator() {
    let el: ElementRef;

    switch (this.activeFilter) {
      case 'where':
        el = this.whereRef;
        break;
      case 'date':
        el = this.dateRef;
        break;
      case 'who':
        el = this.whoRef;
        break;
      default:
        this.indicatorLeft = 0;
        this.indicatorWidth = 0;
        this.indicatorHeight = 0;
        return;
    }

    const nativeEl = el.nativeElement as HTMLElement;
    this.indicatorLeft = nativeEl.offsetLeft;
    this.indicatorWidth = nativeEl.offsetWidth;
    this.indicatorHeight = nativeEl.offsetHeight;
    this.modalTop = nativeEl.offsetTop + nativeEl.offsetHeight;

    if (this.modalRef && this.modalRef.nativeElement) {
      const modalWidth = this.modalRef.nativeElement.offsetWidth;
      const containerElement = this.filterGroupRef.nativeElement;
      const containerWidth = containerElement.offsetWidth;
      let preferredLeft = nativeEl.offsetLeft;

      if (preferredLeft + modalWidth > containerWidth) {
        preferredLeft = containerWidth - modalWidth;
      }
      if (preferredLeft < 0) {
        preferredLeft = 0;
      }

      this.modalLeft = preferredLeft;
    } else {
      this.modalLeft = nativeEl.offsetLeft;
    }
  }

  //who

  guests: Guest[] = [
    {
      label: 'Adults',
      subLabel: 'Ages 13 or above',
      count: 0,
      min: 0,
      max: 12,
    },
    { label: 'Children', subLabel: 'Ages 2-12', count: 0, min: 0, max: 4 },
    { label: 'Infants', subLabel: 'Under 2', count: 0, min: 0, max: 5 },
  ];
  getTotalGuests(): number {
    return this.guests[0].count + this.guests[1].count;
  }

  getInfantsCount(): number {
    return this.guests[2].count;
  }
}
