import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  enabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  toggle(value?) {
    if (value === undefined) {
      value = !this.enabled$.getValue();
    }
    this.enabled$.next(value);
  }
}
