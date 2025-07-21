import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

import { ListingWizardComponent } from './pages/listing-wizard/listing-wizard';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '', component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'experiences', component: Home },
      { path: 'services', component: Home },
    ]
  },
  { path: 'listing-wizard', component: ListingWizardComponent }

];
