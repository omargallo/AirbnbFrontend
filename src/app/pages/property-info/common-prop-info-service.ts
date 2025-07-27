import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonPropInfoService {
  private _clear$ = new Subject<void>();
  clear$ = this._clear$.asObservable();

  clear() {
    this._clear$.next();
  }
}
