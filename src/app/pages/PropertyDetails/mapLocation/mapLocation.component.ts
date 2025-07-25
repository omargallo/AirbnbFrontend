import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapLocation',
    standalone: true,
  imports: [CommonModule],
  templateUrl: './mapLocation.component.html',
  styleUrls: ['./mapLocation.component.css']
})
export class MapLocationComponent implements OnInit {
  @Input() latitude!: number;
  @Input() longitude!: number;

  zoom = 13;
  center: L.LatLngExpression = [0, 0];
  layers: L.Layer[] = [];

  options: L.MapOptions = {
    zoom: this.zoom,
    center: this.center,
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      })
    ],
    scrollWheelZoom: true
  };

  ngOnInit(): void {
    if (this.latitude && this.longitude) {
      this.center = [this.latitude, this.longitude];
      this.options.center = this.center;

      this.layers = [
        L.marker([this.latitude, this.longitude], {
          icon: L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
            shadowSize: [41, 41]
          })
        }).bindPopup("This is the property location.")
      ];
    }
  }
}
