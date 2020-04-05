import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  enabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  text$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() { }

  toggle(value?: boolean) {
    this.setText('');
    if (value === undefined) {
      value = !this.enabled$.getValue();
    }
    this.enabled$.next(value);
  }

  setText(value: string) {
    this.text$.next(value);
  }
}
