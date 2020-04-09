import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Challenge } from '../types/challenge';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SpinnerService } from '../spinner.service';
import { OsdService } from '../osd.service';
import { Point } from 'openseadragon';
import { WelcomeComponent } from './welcome/welcome.component';
import { MatDialog } from '@angular/material/dialog';
import { StopwatchService } from '../stopwatch.service';
import { ChallengeService } from '../challenge.service';
import { HintComponent } from '../hint/hint.component';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  challenge$: Observable<Challenge>;
  @ViewChild('viewer', { static: true }) viewerElement: ElementRef;
  hint$: BehaviorSubject<string> = new BehaviorSubject<string>('...');
  hintTicker$: Subject<string> = new Subject<string>();

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
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.osdService.destroy();
  }

  private loadChallenge(challenge: Challenge) {
    this.osdService.initialize(this.viewerElement.nativeElement);
    const tile = this.challengeService.generateTile(challenge);
    this.osdService.loadTile(tile);
  }

  private onViewportChange(event: any) {
    const viewportBounds = this.osdService.viewer.viewport.getBounds();
    const point = new Point(
      this.challengeService.challenge.afikomanRect.x,
      this.challengeService.challenge.afikomanRect.y
    );
    const result = viewportBounds.containsPoint(point);
    if (result) this.hint$.next('חם');
    else this.hint$.next('קר');
  }

  onHint() {
    this.stopWatch.toggleTimer();
    const dialogRef = this.dialog.open(HintComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.stopWatch.multiplier = 2;
        this.hintTicker$.next('...');
        this.osdService.viewportChange$.pipe(
          takeUntil(this.unsubscribe$),
        ).subscribe(event => this.onViewportChange(event));
        // TODO: fix this observable hell
        setInterval(() => this.hintTicker$.next(this.hint$.getValue()), 2000);
      }
      this.stopWatch.toggleTimer();
    });
  }
}
