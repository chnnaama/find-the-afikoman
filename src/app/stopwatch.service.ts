import { Injectable } from '@angular/core';
import { Challenge } from './types/challenge';

@Injectable({
  providedIn: 'root'
})
export class StopwatchService {
  counter = 0;
  timerRef;
  running = false;
  challenge: Challenge; // stupid place to put it, but easier
  multiplier = 1;

  constructor() { }

  toggleTimer() {
    this.running = !this.running;
    if (this.running) {
      const startTime = Date.now() - (this.counter / this.multiplier || 0);
      this.timerRef = setInterval(() => {
        this.counter = (Date.now() - startTime) * this.multiplier;
      });
    } else {
      this.clearInterval();
    }
  }

  clearInterval() {
    clearInterval(this.timerRef);
  }

  clearTimer() {
    this.running = false;
    this.counter = 0;
    this.multiplier = 1;
    this.clearInterval();
  }
}
