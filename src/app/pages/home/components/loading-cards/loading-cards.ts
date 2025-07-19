import { Component, Input, OnInit } from '@angular/core';
import { SingleLoadingCard } from '../single-loading-card/single-loading-card';
@Component({
  selector: 'app-loading-cards',
  imports: [SingleLoadingCard],
  templateUrl: './loading-cards.html',
  styleUrl: './loading-cards.css'
})
export class LoadingCards implements OnInit{
  @Input() numberOfCards!:number;
  cardsArray:number[]=[]
  ngOnInit(){
    this.cardsArray = Array<number>(this.numberOfCards).fill(0)
  }
}
