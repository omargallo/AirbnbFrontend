import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements AfterViewInit {
  isSearchModalOpen = false;
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
    // this.videoElements.forEach(video => {
    //   video.nativeElement.play().catch(error => {
    //     console.error('Error playing video:', error);
    //   });
    //   video.nativeElement.loop = true;
    // });
    this.videoElements.forEach(video => {
      video.nativeElement.loop = true;
    });
  }

  openSearchModal() {
    this.isSearchModalOpen = true;
  }

  closeSearchModal() {
    this.isSearchModalOpen = false;
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
