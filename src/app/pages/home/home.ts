import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SliderCard } from "./components/slider-card/slider-card";
import { LoadingCards } from "./components/loading-cards/loading-cards";
import { Slider } from '../../shared/components/slider/slider';
import { SingleLoadingCard } from "./components/single-loading-card/single-loading-card";
import { Modal } from "../../shared/components/modal/modal";
import { WishListModal } from "../../components/wish-list-modal/wish-list-modal";
import {  PropertySwiperComponent } from "../../components/mainswiper/mainswiper";
@Component({
  selector: 'app-home',
  imports: [CommonModule, Slider, SliderCard, WishListModal, PropertySwiperComponent],

  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  show=false;
  toggleShow(){
    this.show=!this.show;
  }
   listings:{
        imageUrl: string
        title:string,
        subtitle:string,
        price:number,
        rating:number,
        isFavorite:boolean
   }[] = [
    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },

    {
          imageUrl: "https://a0.muscache.com/im/pictures/hosting/Hosting-1412438800329137974/original/0bdb1558-bddb-4824-8e3a-6767a94e26fe.jpeg?im_w=1200",
        title:"title",
        subtitle:"subtitle",
        price:10,
        rating:4.5,
        isFavorite:true
    },


   ]
}
