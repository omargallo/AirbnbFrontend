import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayout } from "./layout/main-layout/main-layout";
import { HostProperties } from "./components/host-properties/host-properties";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainLayout, HostProperties],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'AirbnbFrontend';
}
