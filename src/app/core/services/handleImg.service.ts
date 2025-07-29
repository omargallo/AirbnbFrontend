import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class HandleImgService {

  handleImage(img: string): string {
    return `${environment.base}${img}`;
  }
}
