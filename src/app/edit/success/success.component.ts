import { Component, OnInit } from '@angular/core';
import { ChallengeService } from '../../challenge.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  constructor(public challengeService: ChallengeService) { }

  ngOnInit(): void {
  }

}
