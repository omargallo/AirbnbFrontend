import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Country, PropertyService } from '../../../core/services/Property/property.service';

@Component({
  selector: 'app-search-where-modal',
  templateUrl: './search-where-modal.html',
  styleUrls: ['./search-where-modal.css', '../../search-filter-group/search-filter-group.css', '../../header/header.css'],
  imports: [TranslateModule, CommonModule]
})
export class SearchWhereModal implements OnChanges {
  @Input() searchValue: string = '';
  isLoading: boolean = false;

  countries: any;
  suggestedDestinations: {
    iconSrc: string;
    description: string;
    country: string,
    city: string,
    state: string
    latitude: number;
    longitude: number;

  }[] = [];

  iconSet: string[] = [
    'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/2cab2315-eab8-4e3b-8ffa-1411745515f3.png',
    'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/03f38150-079a-48ed-a306-c57947717ad9.png',
    'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/9a91d068-0d2a-4f2c-aa5d-bb4992d45d0e.png',
    'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/4f56182b-d556-45ec-95bb-067be0ba62fe.png'];

  @Output() destinationSelected = new EventEmitter<{ country: string, city: string, state: string, latitude: number, longitude: number }>();

  onDestinationSelect(destination: { country: string, city: string, state: string, latitude: number, longitude: number }) {
    this.destinationSelected.emit(destination);
  }

  constructor(private propertyService: PropertyService) { }

  // ngOnInit(): void {
  //   this.propertyService.getNearestProperties(1, 10, 10000).subscribe(res => {
  //     if (res.isSuccess) {
  //       this.suggestedDestinations = res.data.items.map(property => ({
  //         iconSrc: this.getRandomIcon(),
  //         country: property.country,
  //         city: property.city,
  //         state: property.state,
  //         description: property.description.substring(0, 50),
  //         latitude: property.latitude,
  //         longitude: property.longitude
  //       }));
  //     }
  //   });


  //   this.propertyService.getAllCountries().subscribe((response: any) => {
  //     if (!response.error) {
  //       console.log('Countries:', response.data);
  //     }
  //   })
  // }

  getRandomIcon(): string {
    const randomIndex = Math.floor(Math.random() * this.iconSet.length);
    return this.iconSet[randomIndex];
  }



  ngOnChanges(changes: SimpleChanges): void {
    if ('searchValue' in changes) {
      const value = this.searchValue.trim().toLowerCase();

      if (value === '') {
        this.loadSuggestedDestinations();
      } else {

        this.filterCountries(value);

      }
    }

  }



  loadSuggestedDestinations() {
    this.isLoading = true;
    this.propertyService.getNearestProperties(1, 10, 10000).subscribe(res => {
      this.isLoading = false;
      if (res.isSuccess) {
        this.suggestedDestinations = res.data.items.map(property => ({
          iconSrc: this.getRandomIcon(),
          country: property.country,
          city: property.city,
          state: property.state,
          description: property.description.substring(0, 50),
          latitude: property.latitude,
          longitude: property.longitude
        }));
      }
    });
  }

  filterCountries(searchValue: string) {
    this.isLoading = true;

    const parts = searchValue.split(',').map(p => p.trim().toLowerCase()).filter(p => p !== '');

    if (parts.length === 0) {
      this.loadSuggestedDestinations();
      return;
    }

    const countrySearch = parts.length === 1 ? parts[0] : parts[1];
    const citySearch = parts.length >= 1 ? parts[0] : '';

    this.propertyService.getAllCountries().subscribe(response => {
      this.isLoading = false;
      if (!response.error) {
        let matchedCities: any[] = [];

        response.data.forEach((country: Country) => {
          if (citySearch) {
            country.cities.forEach(city => {
              if (city.toLowerCase().includes(citySearch)) {
                matchedCities.push({
                  iconSrc: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                  country: country.country,
                  city,
                  state: '',
                  description: '',
                  latitude: 0,
                  longitude: 0,
                });
              }
            });
          } else {
            if (country.country.toLowerCase().includes(countrySearch)) {
              country.cities.forEach(city => {
                matchedCities.push({
                  iconSrc: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                  country: country.country,
                  city,
                  state: '',
                  description: '',
                  latitude: 0,
                  longitude: 0,
                });
              });
            }
          }
        });

        const fullValue = searchValue.toLowerCase();
        const alreadyIncluded = matchedCities.some(loc => {
          const fullLoc = `${loc.country.toLowerCase()},${loc.city.toLowerCase()}`;
          return fullLoc.includes(fullValue) || fullValue.includes(fullLoc);
        });

        if (!alreadyIncluded && parts.length >= 1) {
          matchedCities.unshift({
            iconSrc: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            country: parts.length > 1 ? parts[1] : parts[0],
            city: parts[0],
            state: '',
            description: 'Previously selected',
            latitude: 0,
            longitude: 0,
          });
        }

        if (matchedCities.length > 10) {
          const filteredExceptSelected = matchedCities.slice(1).slice(1, 10);
          this.suggestedDestinations = [matchedCities[0], ...filteredExceptSelected];
        } else {
          this.suggestedDestinations = matchedCities;
        }
      }
    });
  }






}
