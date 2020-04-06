import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Challenge } from '../types/challenge';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap, tap } from 'rxjs/operators';
import { SpinnerService } from '../spinner.service';
import { OsdService } from '../osd.service';
import { Rect, TiledImageOptions } from 'openseadragon';
import { WelcomeComponent } from './welcome/welcome.component';
import { MatDialog } from '@angular/material/dialog';
import { StopwatchService } from '../stopwatch.service';
import { ChallengeService } from '../challenge.service';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit, OnDestroy {
  challenge$: Observable<Challenge>;
  @ViewChild('viewer', { static: true }) viewerElement: ElementRef;

  constructor(private route: ActivatedRoute,
              private challengeService: ChallengeService,
              private spinner: SpinnerService,
              private osdService: OsdService,
              private dialog: MatDialog,
              private stopWatch: StopwatchService,
              private db: AngularFirestore) {
    this.spinner.toggle(true);
  }

  ngOnInit(): void {
    this.dialog.open(WelcomeComponent)
      .afterClosed()
      .toPromise()
      .then(() => this.stopWatch.toggleTimer());

    this.challenge$ = this.route.params.pipe(
      map(params => params.challengeId),
      switchMap(challengeId => {
        const docRef = this.db.doc<Challenge>(`challenges/${challengeId}`);
        return docRef.valueChanges();
      }),
      tap(challenge => this.challengeService.challenge = challenge),
      tap(challenge => this.loadChallenge(challenge)),
      tap(() => this.spinner.toggle(false)),
      tap(challenge => {
        const rect = new Rect(
          3900,
          2910,
          100,
          100,
        );
        // this.setAfikoman(challenge, rect);
      })
    );
  }

  ngOnDestroy(): void {
    this.osdService.destroy();
  }

  private loadChallenge(challenge: Challenge) {
    this.osdService.initialize(this.viewerElement.nativeElement);
    const tile = this.challengeService.generateTile(challenge);
    this.osdService.loadTile(tile);
  }

  private async setAfikoman(challenge: Challenge, rect: Rect) {
    const docRef = this.db.doc(`challenges/${challenge.id}`);
    const data: Partial<Challenge> = {
      afikomanRect: { ...rect },
      public: true,
      photoCreditUrl: 'https://www.pexels.com/photo/school-colorful-figures-toys-2953771/',
      photoCredit: 'Markus Spiske',
      description: 'לגו',
      level: 2
    };
    await docRef.update(data);
  }
}
