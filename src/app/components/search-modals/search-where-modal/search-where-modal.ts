import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-where-modal',
  templateUrl: './search-where-modal.html',
  styleUrls: ['./search-where-modal.css','../../search-filter-group/search-filter-group.css','../../header/header.css'],
  imports:[TranslateModule,CommonModule]
})
export class SearchWhereModal {
  suggestedDestinations = [
    {
      iconSrc: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/2cab2315-eab8-4e3b-8ffa-1411745515f3.png',
      name: 'New Cairo, Egypt',
      description: 'Near you',
    },
    {
      iconSrc: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/03f38150-079a-48ed-a306-c57947717ad9.png',
      name: 'Luxor, Egypt',
      description: 'For its stunning architecture',
    },
    {
      iconSrc: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/9a91d068-0d2a-4f2c-aa5d-bb4992d45d0e.png',
      name: 'Cairo, Egypt',
      description: 'Because your wishlist has stays in Cairo',
    },
    {
      iconSrc: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/4f56182b-d556-45ec-95bb-067be0ba62fe.png',
      name: 'Sheikh Zayed City, Egypt',
      description: 'For a trip abroad',
    }
  ];

  flexibleSearchOptions = [
    { label: 'Weekend' },
    { label: 'Week' },
    { label: 'Month' }
  ];
}
