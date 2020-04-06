import { Component, OnInit } from '@angular/core';
import { StopwatchService } from '../stopwatch.service';

@Component({
  selector: 'app-congrats',
  templateUrl: './congrats.component.html',
  styleUrls: ['./congrats.component.scss']
})
export class CongratsComponent implements OnInit {

  constructor(public stopwatch: StopwatchService) { }

  ngOnInit(): void {
    this.stopwatch.toggleTimer();
  }

}
