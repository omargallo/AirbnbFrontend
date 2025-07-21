import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayout } from "./layout/main-layout/main-layout";
import { HostProperties } from "./components/host-properties/host-properties";
import { Footer } from "./components/footer/footer";
import { PropertyInfo } from './pages/property-info/property-info';
import { PropertImageGalaryComponent } from './pages/PropertyDetails/propertImage-galary/propertImage-galary.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainLayout, HostProperties, Footer,PropertyInfo,PropertImageGalaryComponent ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'AirbnbFrontend';
}
