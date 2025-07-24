import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/host-header/host-header";
import { Router, RouterOutlet } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-host',
  imports: [HeaderComponent, RouterOutlet, CommonModule],
  templateUrl: './host.html',
  styleUrls: ['./host.css']
})
export class Host {


  noScrollRoute = false;

  constructor(private router: Router) { }
  ngOnInit(): void {
    this.checkIfNoScrollRoute();
  }
  checkIfNoScrollRoute() {
    this.noScrollRoute =
      this.router.url.startsWith('/Messages') ||
      this.router.url.startsWith('/hostsettings/Messages') ||
      this.router.url.startsWith('/hostsettings/availability')
      ;
  }

  ngAfterViewInit(): void {
    this.router.events.subscribe(() => {
      this.checkIfNoScrollRoute();
    });
  }

}
