import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./pages/login/login";
import { Register } from "./pages/register/register";
import { MainLayout } from "./layout/main-layout/main-layout";
import { HostProperties } from "./components/host-properties/host-properties";
import { Footer } from "./components/footer/footer";
import { Loader } from "./shared/components/loader/loader";
import { Confirm } from "./shared/components/confirm/confirm";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Confirm ,Login, Register],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'AirbnbFrontend';
}
