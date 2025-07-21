import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { PropertyInfo } from './pages/property-info/property-info';

import { ListingWizardComponent } from './pages/listing-wizard/listing-wizard';
import { MainLayout } from './layout/main-layout/main-layout';
import { FilteredProperties } from './pages/filtered-properties/filtered-properties';

export const routes: Routes = [

  {
    path: '', component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'experiences', component: Home },
      { path: 'services', component: Home },
      { path: "FilteredProperties", component: FilteredProperties },
       { path: 'property/:propertyId', component: PropertyInfo }
    ]
  },
  { path: 'listing-wizard', component: ListingWizardComponent }


];
