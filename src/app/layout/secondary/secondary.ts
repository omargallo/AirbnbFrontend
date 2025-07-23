import { Component } from '@angular/core';
import { Mainheader } from "../../components/mainheader/mainheader";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-secondary',
  imports: [Mainheader, RouterOutlet],
  templateUrl: './secondary.html',
  styleUrl: './secondary.css'
})
export class Secondary {

}
