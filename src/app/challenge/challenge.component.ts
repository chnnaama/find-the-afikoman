import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Challenge } from '../types/challenge';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap, tap } from 'rxjs/operators';
import { SpinnerService } from '../spinner.service';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit, OnDestroy {
  challenge$: Observable<Challenge>;

  constructor(private route: ActivatedRoute,
              private spinner: SpinnerService,
              private db: AngularFirestore) {
    this.spinner.toggle(true);
  }

  ngOnInit(): void {

    this.challenge$ = this.route.params.pipe(
      map(params => params.challengeId),
      switchMap(challengeId => {
        const docRef = this.db.doc<Challenge>(`challenges/${challengeId}`);
        return docRef.valueChanges();
      }),
      tap(challenge => this.loadChallenge(challenge)),
      tap(() => this.spinner.toggle(false))
    );
  }

  ngOnDestroy(): void {
  }

  private loadChallenge(challenge: Challenge) {
    console.info(challenge);
  }
}
