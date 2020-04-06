import { Component, OnInit } from '@angular/core';
import { StopwatchService } from '../../stopwatch.service';
import { MatDialog } from '@angular/material/dialog';
import { ChallengeService } from '../../challenge.service';

@Component({
  selector: 'app-congrats',
  templateUrl: './congrats.component.html',
  styleUrls: ['./congrats.component.scss']
})
export class CongratsComponent implements OnInit {

  constructor(public stopwatch: StopwatchService,
              public challengeService: ChallengeService) { }

  ngOnInit(): void {
    this.stopwatch.toggleTimer();
  }

}
