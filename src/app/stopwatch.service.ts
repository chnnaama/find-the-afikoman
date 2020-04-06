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

  constructor() { }

  toggleTimer() {
    this.running = !this.running;
    if (this.running) {
      const startTime = Date.now() - (this.counter || 0);
      this.timerRef = setInterval(() => {
        this.counter = Date.now() - startTime;
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
    this.clearInterval();
  }
}
