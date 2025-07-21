import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header";
import { Footer } from '../../components/footer/footer';
import { HostProperties } from "../../components/host-properties/host-properties";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [HeaderComponent, Footer, HostProperties, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
