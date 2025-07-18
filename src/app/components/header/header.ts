import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren, ViewChild, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import moment from 'moment';

import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { FormsModule } from '@angular/forms';


interface Guest {
  label: string;
  subLabel?: string;
  count: number;
  min: number;
  max: number;
}

interface Destination {
  iconSrc: string;
  name: string;
  description: string;
}

interface FlexibleSearchOption {
  label: string;
}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxDaterangepickerMd, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements AfterViewInit, OnDestroy {

  guests: Guest[] = [
    { label: 'Adults', subLabel: 'Ages 13 or above', count: 0, min: 0, max: 12 },
    { label: 'Children', subLabel: 'Ages 2-12', count: 0, min: 0, max: 4 },
    { label: 'Infants', subLabel: 'Under 2', count: 0, min: 0, max: 5 }
  ];
  suggestedDestinations: Destination[] = [
    {
      iconSrc: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/2cab2315-eab8-4e3b-8ffa-1411745515f3.png',
      name: 'New Cairo, Egypt',
      description: 'Near you'
    },
    {
      iconSrc: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/03f38150-079a-48ed-a306-c57947717ad9.png',
      name: 'Luxor, Egypt',
      description: 'For its stunning architecture'
    },
    {
      iconSrc: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/9a91d068-0d2a-4f2c-aa5d-bb4992d45d0e.png',
      name: 'Cairo, Egypt',
      description: 'Because your wishlist has stays in Cairo'
    },
    {
      iconSrc: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/4f56182b-d556-45ec-95bb-067be0ba62fe.png',
      name: 'Sheikh Zayed City, Egypt',
      description: 'For a trip abroad'
    },
    {
      iconSrc: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/b3e75f63-904a-40e3-bf95-07ccd5a52ebc.png',
      name: '6th of October City, Egypt',
      description: 'Near you'
    },
    {
      iconSrc: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/2a08b260-09ac-40f4-9580-7d418cd0bb2f.png',
      name: 'Istanbul, Türkiye',
      description: 'For sights like Galata Tower'
    },
    {
      iconSrc: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/1e6621dc-6bb6-42c3-a65a-ac9acf89703f.png',
      name: 'Maadi El Sarayat El Sharkia, Egypt',
      description: 'Near you'
    },
    {
      iconSrc: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/b96efd7a-cf57-4007-a57f-6e25bc970133.png',
      name: 'Alexandria, Egypt',
      description: 'For its seaside allure'
    },
    {
      iconSrc: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/9bb572b3-2857-4fd2-9200-cafc06918688.png',
      name: 'Pyramids Gardens, Egypt',
      description: 'Near you'
    },
    {
      iconSrc: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/0fdfef7b-76ab-4930-b90e-a19a478d6660.png',
      name: 'Aswan, Egypt',
      description: 'For a trip abroad'
    }
  ];
  flexibleSearchOptions: FlexibleSearchOption[] = [
    { label: 'I\'m flexible' },
    { label: 'Europe' },
    { label: 'Italy' },
    { label: 'United States' },
    { label: 'Spain' },
    { label: 'Greece' }
  ];



  selectedDateRange: { startDate: moment.Moment | null, endDate: moment.Moment | null } = {
    startDate: null,
    endDate: null
  };

  ranges: any = {
    'Today': [moment(), moment()],
    'Tomorrow': [moment().add(1, 'days'), moment().add(1, 'days')],
    'This weekend': [moment().isoWeekday(5), moment().isoWeekday(7)],
    'Next week': [moment().add(1, 'week').startOf('isoWeek'), moment().add(1, 'week').endOf('isoWeek')],
    'Next month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
  };

  locale: any = {
    format: 'MMM DD, YYYY',
    separator: ' - ',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    fromLabel: 'From',
    toLabel: 'To',
    customRangeLabel: 'Custom Range',
    weekLabel: 'W',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
    firstDay: moment.localeData().firstDayOfWeek()
  };

  datesUpdated(range: any) {
    this.selectedDateRange = range;
  }


  selectQuickDate(type: 'today' | 'tomorrow' | 'thisWeekend' | 'addDates' | 'flexibleDates') {
    const today = moment();
    switch (type) {
      case 'today':
        this.selectedDateRange = { startDate: today, endDate: today };
        break;
      case 'tomorrow':
        this.selectedDateRange = { startDate: today.add(1, 'day'), endDate: today.add(1, 'day') };
        break;
      case 'thisWeekend':
        const friday = moment().isoWeekday(5);
        const saturday = moment().isoWeekday(6);
        this.selectedDateRange = { startDate: friday, endDate: saturday };
        break;
      case 'addDates':
        this.selectedDateRange = { startDate: null, endDate: null };
        break;
      case 'flexibleDates':
        this.selectedDateRange = { startDate: null, endDate: null };
        break;
    }
  }

  getFridayDate(): string {
    return moment().isoWeekday(5).format('MMM DD');
  }

  getSaturdayDate(): string {
    return moment().isoWeekday(6).format('MMM DD');
  }

  getTodayFormatted(): string {
    return moment().format('MMM DD');
  }

  getTomorrowFormatted(): string {
    return moment().add(1, 'day').format('MMM DD');
  }



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

  getTotalGuests(): number {
    return this.guests[0].count + this.guests[1].count;
  }

  getInfantsCount(): number {
    return this.guests[2].count;
  }

  dropdownOpen = false;
  dropdownClosing = false;

  toggleDropdown() {
    if (this.dropdownOpen) {
      this.dropdownClosing = true;
      this.dropdownOpen = false;
    } else {
      this.dropdownOpen = true;
      this.dropdownClosing = false;
    }
  }

  onAnimationEnd() {
    if (this.dropdownClosing) {
      this.dropdownClosing = false;
    }
  }

  isModalVisible = false
  isModalAnimatingOut = false;

  activeFilter: string = '';

  indicatorLeft: number = 0;
  indicatorWidth: number = 0;
  indicatorHeight: number = 0;

  modalTop: number = 0;
  modalLeft: number = 0;

  @ViewChild('filterGroupRef') filterGroupRef!: ElementRef;
  @ViewChild('modalRef') modalRef!: ElementRef;

  @ViewChild('whereRef') whereRef!: ElementRef;
  @ViewChild('dateRef') dateRef!: ElementRef;
  @ViewChild('whoRef') whoRef!: ElementRef;

  private modalObserver?: MutationObserver;

  setActive(filter: string) {
    this.activeFilter = filter;
    this.updateIndicator();
    this.openSearchModal(filter);
  }

  get isAnyFilterActive(): boolean {
    return this.activeFilter !== '';
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
      const containerLeft = 0;
      const containerRight = containerWidth;

      let preferredLeft = nativeEl.offsetLeft;

      if (preferredLeft + modalWidth > containerRight) {
        preferredLeft = containerRight - modalWidth;
      }

      if (preferredLeft < containerLeft) {
        preferredLeft = containerLeft;
      }

      this.modalLeft = preferredLeft;

      console.log("modalWidth", modalWidth);
      console.log("containerWidth", containerWidth);
      console.log("preferredLeft", preferredLeft);
      console.log("finalModalLeft", this.modalLeft);

    } else {
      this.modalLeft = nativeEl.offsetLeft;
    }
  }

  constructor(private ngZone: NgZone) { }

  private boundHandleClick = this.handleClickOutside.bind(this);

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

  navItems = [
    {
      label: 'Homes',
      active: true,
      imgSrc: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240',
      videoSources: [
        { src: 'https://a0.muscache.com/videos/search-bar-icons/hevc/house-twirl-selected.mov', type: 'video/mp4; codecs="hvc1"' },
        { src: 'https://a0.muscache.com/videos/search-bar-icons/webm/house-twirl-selected.webm', type: 'video/webm' }
      ],
      poster: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240',
      isNew: false
    },
    {
      label: 'Experiences',
      active: false,
      imgSrc: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/e47ab655-027b-4679-b2e6-df1c99a5c33d.png?im_w=240',
      videoSources: [
        { src: 'https://a0.muscache.com/videos/search-bar-icons/hevc/balloon-twirl.mov', type: 'video/mp4; codecs="hvc1"' },
        { src: 'https://a0.muscache.com/videos/search-bar-icons/webm/balloon-twirl.webm', type: 'video/webm' }
      ],
      poster: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/e47ab655-027b-4679-b2e6-df1c99a5c33d.png?im_w=240',
      isNew: true
    },
    {
      label: 'Services',
      active: false,
      imgSrc: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/3d67e9a9-520a-49ee-b439-7b3a75ea814d.png?im_w=240',
      videoSources: [
        { src: 'https://a0.muscache.com/videos/search-bar-icons/hevc/consierge-twirl.mov', type: 'video/mp4; codecs="hvc1"' },
        { src: 'https://a0.muscache.com/videos/search-bar-icons/webm/consierge-twirl.webm', type: 'video/webm' }
      ],
      poster: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/3d67e9a9-520a-49ee-b439-7b3a75ea814d.png?im_w=240',
      isNew: true
    }
  ];

  @ViewChildren('navVideo') videoElements!: QueryList<ElementRef<HTMLVideoElement>>;

  ngAfterViewInit() {
    this.videoElements.forEach(video => {
      video.nativeElement.loop = true;
    });

    document.addEventListener('click', this.boundHandleClick);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.boundHandleClick);

    if (this.modalObserver) {
      this.modalObserver.disconnect();
    }
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
        attributes: true
      });
    }
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

  toggleNavItem(index: number) {
    this.navItems.forEach((item, i) => {
      item.active = i === index;
    });
  }

  playVideo(event: MouseEvent) {
    const video = (event.currentTarget as HTMLElement).querySelector('video');
    if (video) {
      video.play().catch(error => {
        console.warn('Autoplay blocked until user interaction:', error);
      });
      video.loop = true;
      video.style.transform = 'scale(1.1)';
      video.style.transition = 'transform 0.3s ease-in-out';
    }
  }

  pauseVideo(event: MouseEvent) {
    const video = (event.currentTarget as HTMLElement).querySelector('video');
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }
}
