import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { StopwatchService } from '../stopwatch.service';
import { MatDialog } from '@angular/material/dialog';
import { PauseComponent } from '../pause/pause.component';
import { Challenge } from '../types/challenge';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss']
})
export class StopwatchComponent implements OnInit, OnDestroy {
  @Input() challenge: Challenge;

  constructor(public stopwatch: StopwatchService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.stopwatch.clearTimer();
    this.stopwatch.challenge = this.challenge;
  }


  ngOnDestroy() {
    this.stopwatch.clearTimer();
  }

  pauseTimer() {
    this.stopwatch.toggleTimer();
    this.dialog.open(PauseComponent)
      .afterClosed()
      .toPromise()
      .then(() => this.stopwatch.toggleTimer());
  }
}
