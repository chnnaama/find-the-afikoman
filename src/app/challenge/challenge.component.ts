import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Challenge } from '../types/challenge';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap, tap } from 'rxjs/operators';
import { SpinnerService } from '../spinner.service';
import { OsdService } from '../osd.service';
import { Rect, TiledImageOptions } from 'openseadragon';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss']
})
export class ChallengeComponent implements OnInit, OnDestroy {
  challenge$: Observable<Challenge>;
  @ViewChild('viewer', { static: true }) viewerElement: ElementRef;

  constructor(private route: ActivatedRoute,
              private spinner: SpinnerService,
              private osdService: OsdService,
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
      tap(() => this.spinner.toggle(false)),
      // tap(challenge => {
      //   const rect = new Rect(1045, 2615, 40, 40 );
      //   this.setAfikoman(challenge, rect);
      // })
    );
  }

  ngOnDestroy(): void {
    this.osdService.destroy();
  }

  private loadChallenge(challenge: Challenge) {
    this.osdService.initialize(this.viewerElement.nativeElement);
    const tile = this.generateTile(challenge);
    this.osdService.loadTile(tile);
  }

  private generateTile(challenge: Challenge) {
    const tileSource = `https://storage.googleapis.com/find-the-afikoman.appspot.com/images/${challenge.uid}/dzi@${challenge.id}.jpg.dzi`;
    const tiledImageOptions: TiledImageOptions = {
      tileSource,
      fitBounds: new Rect(0, 0, 5833, 3620 ), // TODO: WHY???? solves overlay issue
      preload: true,
    };

    return tiledImageOptions;
  }

  private async setAfikoman(challenge: Challenge, rect: Rect) {
    const docRef = this.db.doc(`challenges/${challenge.id}`);
    await docRef.update( {
      afikomanRect: { ...rect }
    });
  }
}
