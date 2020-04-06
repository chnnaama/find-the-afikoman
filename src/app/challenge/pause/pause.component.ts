import { Component, Input, OnInit } from '@angular/core';
import { Challenge } from '../../types/challenge';
import { StopwatchService } from '../../stopwatch.service';

@Component({
  selector: 'app-pause',
  templateUrl: './pause.component.html',
  styleUrls: ['./pause.component.scss']
})
export class PauseComponent implements OnInit {
  constructor(public stopwatch: StopwatchService) { }

  ngOnInit(): void {
    console.info(this.stopwatch.challenge);
  }

}
