import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hostheader',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './host-header.html',
  styleUrls: ['./host-header.css'],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
