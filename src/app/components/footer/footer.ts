import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
activeTab = 'categories';

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  categories = [
    'Amazing pools', 'Arctic', 'Camping', 'Campers',
    'Castles', 'Containers', 'Countryside', 'Design',
    'Earth homes', 'Farms', 'National parks', 'OMG!',
    'Tiny homes', 'Towers', 'Windmills', 'Vineyards', 'Luxe'
  ];
  unique = [
  { style: "Cabins", location: "United States" },
  { style: "Treehouses", location: "United States" },
  { style: "Tiny Houses", location: "United States" },
  { style: "Beach Houses", location: "United States" },
  { style: "Lakehouses", location: "United States" },
  { style: "Yurt Rentals", location: "United States" },
  { style: "Yurt Rentals", location: "United Kingdom" },
  { style: "Castle Rentals", location: "United States" },
  { style: "Houseboats", location: "United States" },
  { style: "Holiday Caravans", location: "United Kingdom" },
  { style: "Private Island Rentals", location: "United States" },
  { style: "Farm Houses", location: "United States" },
  { style: "Farm Cottages", location: "United Kingdom" },
  { style: "Cabin Rentals", location: "Australia" },
  { style: "Luxury Cabins", location: "United Kingdom" },
  { style: "Luxury Cabins", location: "United States" },
  { style: "Holiday Chalets", location: "United Kingdom" },
  { style: "Cottage Rentals", location: "United States" },
  { style: "Holiday Cottages", location: "United Kingdom" },
  { style: "Mansion Rentals", location: "United States" },
  { style: "Villa Rentals", location: "United Kingdom" },
  { style: "Holiday Bungalows", location: "United Kingdom" },
  { style: "Bungalow Rentals", location: "United States" },
  { style: "Condo Rentals", location: "United States" },
  { style: "Holiday Apartments", location: "Australia" },
  { style: "Holiday Houses", location: "United States" },
  { style: "Holiday Houses", location: "United Kingdom" },
  { style: "Private Holiday Rentals", location: "United Kingdom" },
  { style: "Big House Rentals", location: "United States" },
  { style: "Big Cottages", location: "Australia" },
  { style: "Large Villas", location: "United Kingdom" },
  { style: "House Rentals with a Pool", location: "United States" },
  { style: "Cabin Rentals with a Pool", location: "United States" },
  { style: "Villas with a Pool", location: "United Kingdom" },
  { style: "Apartments with a Hot Tub", location: "United States" },
  { style: "Holiday Cottages with a Hot Tub", location: "United Kingdom" },
  { style: "Beach Cabins", location: "United States" },
  { style: "Beach Condos", location: "United States" },
  { style: "Beachfront Rentals", location: "United States" },
  { style: "Beach Houses", location: "United Kingdom" },
  { style: "Beach Villas", location: "United Kingdom" },
  { style: "Coastal Cottages", location: "United Kingdom" },
  { style: "Pet-Friendly Vacation Rentals", location: "United States" },
  { style: "Pet-Friendly Beach Rentals", location: "United States" },
  { style: "Pet-Friendly Cabin Rentals", location: "United States" },
  { style: "Dog-Friendly Cottages", location: "United Kingdom" },
  { style: "Luxury Dog-Friendly Cottages", location: "United Kingdom" }
];

tips= [
  { tip: "Family travel hub", note: "Tips and inspiration" },
  { tip: "Family budget travel", note: "Get there for less" },
  { tip: "Vacation ideas for any budget", note: "Make it special without making it spendy" },
  { tip: "Travel Europe on a budget", note: "How to take the kids to Europe for less" },
  { tip: "Outdoor adventure", note: "Explore nature with the family" },
  { tip: "Bucket list national parks", note: "Must-see parks for family travel" },
  { tip: "Kid-friendly state parks", note: "Check out these family-friendly hikes" }
];

apartments = [
  { city: "Atlanta Metro", state: "Georgia" },
  { city: "Augusta", state: "Georgia" },
  { city: "Austin Metro", state: "Texas" },
  { city: "Baton Rouge", state: "Louisiana" },
  { city: "Birmingham", state: "Alabama" },
  { city: "Boise", state: "Idaho" },
  { city: "Boston Metro", state: "Massachusetts" },
  { city: "Boulder", state: "Colorado" },
  { city: "Charlotte", state: "North Carolina" },
  { city: "Chicago Metro", state: "Illinois" },
  { city: "Cincinnati", state: "Ohio" },
  { city: "Columbus", state: "Ohio" },
  { city: "Crestview", state: "Florida" },
  { city: "Dallas", state: "Texas" },
  { city: "Denver", state: "Colorado" },
  { city: "Fayetteville", state: "North Carolina" },
  { city: "Fort Myers", state: "Florida" },
  { city: "Fort Worth", state: "Texas" },
  { city: "Frankfort", state: "Kentucky" },
  { city: "Fresno", state: "California" },
  { city: "Greeley", state: "Colorado" },
  { city: "Greenville-Greer", state: "South Carolina" },
  { city: "Hartford", state: "Connecticut" },
  { city: "Hoboken", state: "New Jersey" },
  { city: "Houston Metro", state: "Texas" },
  { city: "Indianapolis", state: "Indiana" },
  { city: "Jacksonville", state: "Florida" },
  { city: "Lacey", state: "Washington" },
  { city: "Lexington Park", state: "Maryland" },
  { city: "Los Angeles", state: "California" },
  { city: "Loveland", state: "Colorado" },
  { city: "Madison", state: "Alabama" },
  { city: "Memphis", state: "Tennessee" },
  { city: "Miami", state: "Florida" },
  { city: "Minneapolis", state: "Minnesota" },
  { city: "Myrtle Beach", state: "South Carolina" },
  { city: "Narragansett", state: "Rhode Island" },
  { city: "Nashville Metro", state: "Tennessee" },
  { city: "Orange County", state: "California" },
  { city: "Marin County", state: "California" },
  { city: "Norfolk", state: "Virginia" },
  { city: "East Bay", state: "California" },
  { city: "Oklahoma City", state: "Oklahoma" },
  { city: "Orlando Metro", state: "Florida" },
  { city: "Panama City", state: "Florida" },
  { city: "Petaluma", state: "California" },
  { city: "Philadelphia Metro", state: "Pennsylvania" },
  { city: "Phoenix", state: "Arizona" },
  { city: "Pittsburgh", state: "Pennsylvania" },
  { city: "Port Arthur", state: "Texas" },
  { city: "Portland, ME", state: "Maine" },
  { city: "Portland", state: "Oregon" },
  { city: "Prescott Valley", state: "Arizona" },
  { city: "Raleigh", state: "North Carolina" },
  { city: "Riverside", state: "California" },
  { city: "Sacramento", state: "California" },
  { city: "Salt Lake City", state: "Utah" },
  { city: "San Antonio", state: "Texas" },
  { city: "San Diego", state: "California" },
  { city: "San Francisco", state: "California" },
  { city: "San Jose", state: "California" },
  { city: "Santa Rosa Beach", state: "Florida" },
  { city: "Sarasota", state: "Florida" },
  { city: "Savannah", state: "Georgia" },
  { city: "Seattle Metro", state: "Washington" },
  { city: "San Francisco Peninsula", state: "California" },
  { city: "Spokane", state: "Washington" },
  { city: "St. Augustine", state: "Florida" },
  { city: "Stamford", state: "Connecticut" },
  { city: "Tampa Bay", state: "Florida" },
  { city: "Ventura County", state: "California" },
  { city: "Baltimore County", state: "Maryland" },
  { city: "Tulsa", state: "Oklahoma" },
  { city: "Washington Metro", state: "District of Columbia" },
  { city: "West Palm Beach", state: "Florida" },
  { city: "Wildwood", state: "Florida" },
  { city: "Wilmington, NC", state: "North Carolina" }
];

  supportLinks = [
    'Help Center', 'AirCover', 'Anti-discrimination',
    'Disability support', 'Cancellation options',
    'Report neighborhood concern'
  ];

  hostingLinks = [
    'Airbnb your home', 'Airbnb your experience', 'Airbnb your service',
    'AirCover for Hosts', 'Hosting resources', 'Community forum',
    'Hosting responsibly', 'Airbnb-friendly apartments',
    'Join a free Hosting class'
  ];

  airbnbLinks = [
    '2025 Summer Release', 'Newsroom', 'Careers',
    'Investors', 'Gift cards', 'Airbnb.org emergency stays'
  ];
}
