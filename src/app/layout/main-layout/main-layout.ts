import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header";
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-main-layout',
  imports: [HeaderComponent, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
