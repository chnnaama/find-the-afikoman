import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Challenge } from '../types/challenge';
import { ActivatedRoute } from '@angular/router';
import { ChallengeService } from '../challenge.service';
import { SpinnerService } from '../spinner.service';
import { OsdService } from '../osd.service';
import { MatDialog } from '@angular/material/dialog';
import { StopwatchService } from '../stopwatch.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { InstructionsComponent } from './instructions/instructions.component';
import { map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { Rect } from 'openseadragon';
import { SuccessComponent } from './success/success.component';

class AfikomanPlacement {
  x: number;
  y: number;
  width: number;
  height: number;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  challenge$: Observable<Challenge>;
  afikomanPlacement: AfikomanPlacement;
  @ViewChild('viewer', { static: true }) viewerElement: ElementRef;
  @ViewChild('afikoman', { static: true }) afikomanElement: ElementRef;

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
    this.dialog.open(InstructionsComponent);

    this.challenge$ = this.route.params.pipe(
      map(params => params.challengeId),
      switchMap(challengeId => {
        const docRef = this.db.doc<Challenge>(`challenges/${challengeId}`);
        return docRef.valueChanges();
      }),
      take(1),
      tap(challenge => this.challengeService.challenge = challenge),
      tap(challenge => this.loadChallenge(challenge)),
      tap(() => this.spinner.toggle(false)),
    );

    this.osdService.canvasClick$.pipe(takeUntil(this.unsubscribe$))
      .subscribe(event => this.onCanvasClick(event));
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

    this.afikomanPlacement = {
      x: challenge.width / 2 - challenge.width / 20,
      y: challenge.height / 2 - challenge.width / 20,
      width: challenge.width / 10,
      height: challenge.width / 10
    };

    this.initializeAfikoman();
  }

  private async saveChallenge(challenge: Challenge) {
    const docRef = this.db.doc(`challenges/${challenge.id}`);
    await docRef.update(challenge);
  }

  private onCanvasClick(event: any) {
    if (!this.osdService.isClickQuick) return;
    const imagePoint = this.osdService.viewer.viewport.viewerElementToImageCoordinates(event.position);
    if (imagePoint.x < 0 || imagePoint.x > this.challengeService.challenge.width) return;
    if (imagePoint.y < 0 || imagePoint.y > this.challengeService.challenge.height) return;
    this.afikomanPlacement.x = imagePoint.x - this.afikomanPlacement.width / 2;
    this.afikomanPlacement.y = imagePoint.y - this.afikomanPlacement.height / 2;
    this.placeAfikoman();
  }


  private initializeAfikoman() {
    this.osdService.removeAllOverlays();
    const rect = new Rect(
      this.afikomanPlacement.x,
      this.afikomanPlacement.y,
      this.afikomanPlacement.width,
      this.afikomanPlacement.height);
    this.osdService.addOverlay(
      this.afikomanElement.nativeElement,
      rect
    );
  }

  private placeAfikoman() {
    const rect = new Rect(
      this.afikomanPlacement.x,
      this.afikomanPlacement.y,
      this.afikomanPlacement.width,
      this.afikomanPlacement.height);
    this.osdService.updateOverlay(
      this.afikomanElement.nativeElement,
      rect
    );
  }

  resize(change: number) {
    if (change < 0 && this.afikomanPlacement.width / this.challengeService.challenge.width < 0.004) return;
    if (change > 0 && this.afikomanPlacement.width / this.challengeService.challenge.width > 0.2) return;

    this.afikomanPlacement.width = (10 + change) / 10 * this.afikomanPlacement.width;
    this.afikomanPlacement.height = (10 + change) / 10 * this.afikomanPlacement.height;
    this.placeAfikoman();
  }

  async onFinish() {
    const challenge = this.challengeService.challenge;
    // challenge.afikomanRect = { ...this.afikomanPlacement };
    // challenge.photoCredit = 'stock.adobe.com';
    // challenge.photoCreditUrl = 'https://stock.adobe.com';
    // challenge.description = 'הר רשמור, ארצות-הברית';
    // challenge.level = 2;
    // challenge.public = true;

    await this.saveChallenge(challenge);
    this.dialog.open(SuccessComponent, {
      disableClose: true
    });
  }

  onHelpClick() {
    this.dialog.open(InstructionsComponent);
  }

}
