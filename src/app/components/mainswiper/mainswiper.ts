import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {register} from 'swiper/element/bundle';
import { SliderCard } from "../../pages/home/components/slider-card/slider-card";

register();

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  currency: string;
  nights: number;
  rating: number;
  image: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-property-swiper',
  standalone: true,
  imports: [CommonModule, SliderCard],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './mainswiper.html',
  styleUrls: ['./mainswiper.css']
})
export class PropertySwiperComponent implements OnInit {
  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;
  
  isBeginning = true;
  isEnd = false;
  
  properties: Property[] = [
    {
      id: 1,
      title: 'Condo in Al Shorouk City',
      location: 'New Cairo',
      price: 26993,
      currency: 'ج.م',
      nights: 26,
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      isFavorite: false
    },
    {
      id: 2,
      title: 'Apartment in el-andalos,',
      location: 'New Cairo',
      price: 30483,
      currency: 'ج.م',
      nights: 26,
      rating: 4.89,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      isFavorite: false
    },
    {
      id: 3,
      title: 'Apartment in New Cairo City',
      location: 'New Cairo',
      price: 52236,
      currency: 'ج.م',
      nights: 26,
      rating: 4.89,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      isFavorite: false
    },
    {
      id: 4,
      title: 'Apartment in Cairo',
      location: 'Downtown Cairo',
      price: 56729,
      currency: 'ج.م',
      nights: 26,
      rating: 4.98,
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2348&q=80',
      isFavorite: false
    },
    {
      id: 5,
      title: 'Apartment in Cairo',
      location: 'Cairo',
      price: 65965,
      currency: 'ج.م',
      nights: 26,
      rating: 4.98,
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      isFavorite: false
    },
    {
      id: 6,
      title: 'Apartment in New Cairo 1',
      location: 'New Cairo',
      price: 60226,
      currency: 'ج.م',
      nights: 26,
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      isFavorite: false
    },
    {
      id: 7,
      title: 'Apartment in New Cairo 1',
      location: 'New Cairo',
      price: 78650,
      currency: 'ج.م',
      nights: 26,
      rating: 4.92,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      isFavorite: false
    },
      {
      id: 8,
      title: 'Apartment in Cairo',
      location: 'Downtown Cairo',
      price: 56729,
      currency: 'ج.م',
      nights: 26,
      rating: 4.98,
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2348&q=80',
      isFavorite: false
    },
    {
      id: 9,
      title: 'Apartment in Cairo',
      location: 'Cairo',
      price: 65965,
      currency: 'ج.م',
      nights: 26,
      rating: 4.98,
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      isFavorite: false
    },
    {
      id: 10,
      title: 'Apartment in New Cairo 1',
      location: 'New Cairo',
      price: 60226,
      currency: 'ج.م',
      nights: 26,
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      isFavorite: false
    },
  ];

  ngOnInit(): void {
    setTimeout(() => {
      this.setupSwiperEvents();
    }, 100);
  }

  private setupSwiperEvents(): void {
    const swiperEl = this.swiperEl?.nativeElement;
    if (swiperEl) {
      swiperEl.addEventListener('swiperslidechange', () => {
        this.updateNavigationState();
      });
      
      swiperEl.addEventListener('swiperreachbeginning', () => {
        this.isBeginning = true;
      });
      
      swiperEl.addEventListener('swiperreachend', () => {
        this.isEnd = true;
      });
      
      swiperEl.addEventListener('swiperfrombeginning', () => {
        this.isBeginning = false;
      });
      
      swiperEl.addEventListener('swiperfromend', () => {
        this.isEnd = false;
      });
    }
  }

  private updateNavigationState(): void {
    const swiperEl = this.swiperEl?.nativeElement;
    if (swiperEl?.swiper) {
      this.isBeginning = swiperEl.swiper.isBeginning;
      this.isEnd = swiperEl.swiper.isEnd;
    }
  }

  slideNext(): void {
    const swiperEl = this.swiperEl?.nativeElement;
    if (swiperEl?.swiper) {
      swiperEl.swiper.slideNext();
    }
  }

  slidePrev(): void {
    const swiperEl = this.swiperEl?.nativeElement;
    if (swiperEl?.swiper) {
      swiperEl.swiper.slidePrev();
    }
  }


  trackByPropertyId(index: number, property: Property): number {
    return property.id;
  }
}