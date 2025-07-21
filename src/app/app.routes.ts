import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { PropertyInfo } from './pages/property-info/property-info';

export const routes: Routes = [
    {path:"", component:Home},
    { path: 'property/1', component: PropertyInfo }
];
